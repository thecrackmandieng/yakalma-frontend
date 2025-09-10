import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeaderLivreurComponent } from "../../header-livreur/header-livreur.component";
import { FooterComponent } from "../../footer/footer.component";
import { CommonModule } from '@angular/common';
import { PartenaireService, Order as BaseOrder } from '../../../services/partenaire.service';

declare var google: any;

type Order = BaseOrder & {
  image?: string;
  routeInfo?: { distance: string; duration: string };
};

@Component({
  selector: 'app-livreur-dashboard',
  standalone: true,
  imports: [HeaderLivreurComponent, FooterComponent, CommonModule],
  templateUrl: './livreur-dashboard.component.html',
  styleUrls: ['./livreur-dashboard.component.css']
})
export class LivreurDashboardComponent implements OnInit {

  isBrowser: boolean;
  selectedOrder: Order | null = null;
  orders: Order[] = [];
  userLocation: { latitude: number; longitude: number } | null = null;
  clientLocation: { latitude: number; longitude: number } | null = null;
  isLoadingLocation = false;
  locationError: string | null = null;

  map: any = null;
  clientMarker: any = null;
  courierMarker: any = null;
  directionsRenderer: any = null;
  routeSteps: Array<google.maps.DirectionsStep & { spoken?: boolean }> = [];
  watchId: number | null = null;
  private spokenInstructions = new Set<string>();

  constructor(
    private partenaireService: PartenaireService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadDeliveredOrders();
  }

  loadDeliveredOrders(): void {
    this.partenaireService.getDeliveredOrders().subscribe({
      next: orders => {
        this.orders = orders.map(order => ({
          ...order,
          image: this.getImageUrl(order)
        }));
      },
      error: err => console.error('Erreur chargement commandes livrées :', err)
    });
  }

  acceptOrder(order: Order): void {
    if (order.status === 'livre') {
      this.partenaireService.assignOrderToCourier(order._id!).subscribe({
        next: updated => {
          order.status = updated.status;
          order.courierId = updated.courierId;
        },
        error: err => console.error('Erreur assignation :', err)
      });
    }
  }

  // ✅ Correction ici
  async showMap(order: Order): Promise<void> {
    if (!this.isBrowser) return;
    this.selectedOrder = { ...order };

    await this.loadGoogleMapsScript();

    // 1. Position du livreur
    await this.getCurrentLocation();

    // 2. Position du client
    if (order.address) {
      try {
        this.clientLocation = await this.geocodeAddress(order.address);
      } catch (error) {
        console.error('Erreur géocodage adresse client:', error);
        this.clientLocation = { latitude: 14.6928, longitude: -17.4467 }; // Dakar fallback
      }
    } else {
      this.clientLocation = { latitude: 14.6928, longitude: -17.4467 };
    }

    // 3. Lancer la carte seulement si les deux positions existent
    if (this.userLocation && this.clientLocation) {
      this.initGoogleMap();
      this.calculateRoute();
      this.startTrackingPosition();
    } else {
      console.error("Impossible de calculer la route : positions manquantes");
    }
  }

  private async loadGoogleMapsScript(): Promise<void> {
    if ((window as any).google) return;
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAGs3CBy6cHrNqb3d0ZS89NlY-8jmwwXzU`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = err => reject(err);
      document.head.appendChild(script);
    });
  }

  async getCurrentLocation(): Promise<void> {
    if (!this.isBrowser) return;
    this.isLoadingLocation = true;
    this.locationError = null;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 30000 })
      );
      this.userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      this.locationError = "Impossible d'obtenir votre position GPS";
      console.error('Erreur géolocalisation:', error);
    } finally {
      this.isLoadingLocation = false;
    }
  }

  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            latitude: location.lat(),
            longitude: location.lng()
          });
        } else {
          reject('Erreur de géocodage: ' + status);
        }
      });
    });
  }

  initGoogleMap(): void {
    if (!this.selectedOrder || !this.userLocation || !this.clientLocation) return;
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    this.map = new google.maps.Map(mapContainer, {
      center: { lat: this.userLocation.latitude, lng: this.userLocation.longitude },
      zoom: 14
    });

    this.courierMarker = new google.maps.Marker({
      position: { lat: this.userLocation.latitude, lng: this.userLocation.longitude },
      map: this.map,
      title: 'Votre position',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    this.clientMarker = new google.maps.Marker({
      position: { lat: this.clientLocation.latitude, lng: this.clientLocation.longitude },
      map: this.map,
      title: 'Adresse du client'
    });

    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map });
  }

  calculateRoute(): void {
    if (!this.userLocation || !this.selectedOrder || !this.map || !this.clientLocation) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route({
      origin: { lat: this.userLocation.latitude, lng: this.userLocation.longitude },
      destination: { lat: this.clientLocation.latitude, lng: this.clientLocation.longitude },
      travelMode: google.maps.TravelMode.DRIVING
    }, (result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
        const route = result.routes[0]?.legs[0];
        if (route) {
          this.selectedOrder!.routeInfo = {
            distance: route.distance?.text ?? '0 km',
            duration: route.duration?.text ?? '0 min'
          };
          this.routeSteps = route.steps.map(step => ({ ...step, spoken: false }));
        }
      } else {
        console.error('Erreur calcul itinéraire:', status);
      }
    });
  }

  startNavigation(): void {
    if (!this.userLocation || !this.selectedOrder || !this.map) return;
    this.spokenInstructions.clear();
    this.calculateRoute();
    this.startTrackingPosition();
  }

  startTrackingPosition(): void {
    if (!this.isBrowser || !navigator.geolocation) return;

    this.watchId = navigator.geolocation.watchPosition(
      position => {
        if (!this.courierMarker) return;

        this.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        this.courierMarker.setPosition({ lat: this.userLocation.latitude, lng: this.userLocation.longitude });
        this.map.setCenter({ lat: this.userLocation.latitude, lng: this.userLocation.longitude });

        this.calculateRoute();

        this.routeSteps.forEach(step => {
          if (!step.end_location) return;
          const stepLat = step.end_location.lat();
          const stepLng = step.end_location.lng();
          const distance = this.getDistance(this.userLocation!.latitude, this.userLocation!.longitude, stepLat, stepLng);

          if (distance < 30 && !step.spoken) {
            const instruction = step.instructions.replace(/<[^>]+>/g, '');
            this.speakFrench(instruction);
            step.spoken = true;
          }
        });
      },
      err => {
        if (err.code === 1) {
          this.locationError = "⚠️ Permission refusée. Activez la localisation.";
        } else if (err.code === 2) {
          this.locationError = "⚠️ Position indisponible. Vérifiez votre GPS ou réseau.";
        } else if (err.code === 3) {
          this.locationError = "⚠️ Temps d’attente dépassé. Essayez à nouveau.";
        }
        console.error('Erreur suivi GPS:', err);
      },
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
  }

  stopTrackingPosition(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  speakFrench(text: string): void {
    if (!this.isBrowser || !('speechSynthesis' in window)) return;

    if (this.spokenInstructions.has(text)) return;
    this.spokenInstructions.add(text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();
    const frenchVoice = voices.find(voice => voice.lang.startsWith('fr'));
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.onerror = (event) => {
      console.error('Erreur synthèse vocale:', event.error);
    };

    speechSynthesis.speak(utterance);
  }

  closeModal(): void {
    this.selectedOrder = null;
    this.clientLocation = null;
    this.stopTrackingPosition();
    this.map = null;
    this.clientMarker = null;
    this.courierMarker = null;
    this.directionsRenderer = null;
    this.routeSteps = [];
    this.spokenInstructions.clear();
  }

  getImageUrl(order: Order): string {
    const firstItem = order.items?.[0];
    if (firstItem?.image) {
      if (firstItem.image.startsWith('http') || firstItem.image.startsWith('data:')) return firstItem.image;
      return `https://yakalma.onrender.com/${firstItem.image}`;
    }
    return 'assets/riz.png';
  }

  private getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
