import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeaderLivreurComponent } from "../../header-livreur/header-livreur.component";
import { FooterComponent } from "../../footer/footer.component";
import { CommonModule } from '@angular/common';
import { PartenaireService, Order as BaseOrder } from '../../../services/partenaire.service';
import { GoogleMapsLoaderService } from './google-maps-loader.service';

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
  isLoading: boolean = true;
  userLocation: { latitude: number; longitude: number } | null = null;
  clientLocation: { latitude: number; longitude: number } | null = null;
  isLoadingLocation = false;
  locationError: string | null = null;

  map: any = null;
  clientMarker: any = null;
  courierMarker: any = null;
  directionsRenderer: any = null;
  polyline: any = null;
  routeSteps: Array<google.maps.DirectionsStep & { spoken?: boolean }> = [];
  watchId: number | null = null;
  private spokenInstructions = new Set<string>();

  constructor(
    private partenaireService: PartenaireService,
    private googleMapsLoader: GoogleMapsLoaderService,
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
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur chargement commandes livrées :', err);
        this.isLoading = false;
      }
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

  async showMap(order: Order): Promise<void> {
    if (!this.isBrowser) return;
    this.selectedOrder = { ...order };

    try {
      // Tenter de charger Google Maps avec le service amélioré
      await this.googleMapsLoader.loadGoogleMaps();

      // Vérifier si Google Maps est bien disponible après le chargement
      if (this.googleMapsLoader.isGoogleMapsAvailable()) {
        // Google Maps est disponible, procéder normalement
        await this.getCurrentLocation();

        if (order.address) {
          this.clientLocation = await this.geocodeAddress(order.address);
        } else {
          this.clientLocation = { latitude: 14.6928, longitude: -17.4467 }; // fallback Dakar
        }

        this.initGoogleMap();
        this.calculateRoute();
        this.startTrackingPosition();
      } else {
        // Google Maps n'est pas disponible, utiliser une alternative avec OpenStreetMap
        console.warn('⚠️ Google Maps indisponible. Utilisation d\'OpenStreetMap comme alternative.');
        this.locationError = 'Google Maps indisponible. Utilisation d\'OpenStreetMap comme alternative.';
        await this.initOpenStreetMap(order);
      }
    } catch (err) {
      console.error('Erreur lors de l\'affichage de la carte:', err);

      // En cas d'erreur, essayer OpenStreetMap comme solution de secours
      console.warn('⚠️ Erreur Google Maps. Utilisation d\'OpenStreetMap comme solution de secours.');
      this.locationError = 'Erreur avec Google Maps. Utilisation d\'OpenStreetMap comme solution de secours.';
      await this.initOpenStreetMap(order);
    }
  }

  async initOpenStreetMap(order: Order): Promise<void> {
    try {
      // Charger Leaflet.js dynamiquement
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!(window as any).L) {
        await this.loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
      }

      await this.getCurrentLocation();

      if (order.address) {
        // Utiliser un service de géocodage alternatif pour OpenStreetMap
        this.clientLocation = await this.geocodeAddressOpenStreetMap(order.address);
      } else {
        this.clientLocation = { latitude: 14.6928, longitude: -17.4467 }; // fallback Dakar
      }

      // Initialiser la carte avec Leaflet
      const mapContainer = document.getElementById('map-container');
      if (!mapContainer) {
        console.error('Container de carte introuvable');
        return;
      }

      // Vider le contenu précédent
      mapContainer.innerHTML = '';

      // Créer la carte
      const map = (window as any).L.map('map-container').setView(
        [this.userLocation?.latitude || 14.6928, this.userLocation?.longitude || -17.4467],
        14
      );

      // Ajouter le fond de carte
      (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Ajouter des marqueurs pour la position du livreur et du client
      if (this.userLocation) {
        (window as any).L.marker([this.userLocation.latitude, this.userLocation.longitude])
          .addTo(map)
          .bindPopup('Votre position')
          .openPopup();
      }

      if (this.clientLocation) {
        (window as any).L.marker([this.clientLocation.latitude, this.clientLocation.longitude])
          .addTo(map)
          .bindPopup('Position du client')
          .openPopup();
      }

      // Dessiner une ligne entre les deux positions
      if (this.userLocation && this.clientLocation) {
        const route = [
          [this.userLocation.latitude, this.userLocation.longitude],
          [this.clientLocation.latitude, this.clientLocation.longitude]
        ];

        (window as any).L.polyline(route, {color: 'red'}).addTo(map);

        // Ajuster la vue pour inclure les deux marqueurs
        const group = (window as any).L.featureGroup([
          (window as any).L.marker([this.userLocation.latitude, this.userLocation.longitude]),
          (window as any).L.marker([this.clientLocation.latitude, this.clientLocation.longitude])
        ]);
        map.fitBounds(group.getBounds().pad(0.5));
      }

      this.map = map;
    } catch (err) {
      console.error('Erreur lors de l\'initialisation d\'OpenStreetMap:', err);
      this.locationError = 'Impossible d\'afficher la carte. Veuillez réessayer plus tard.';
    }
  }

  async geocodeAddressOpenStreetMap(address: string): Promise<{ latitude: number; longitude: number }> {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      } else {
        throw new Error('Adresse non trouvée');
      }
    } catch (error) {
      console.error('Erreur de géocodage OpenStreetMap:', error);
      // Fallback sur les coordonnées de Dakar si le géocodage échoue
      return { latitude: 14.6928, longitude: -17.4467 };
    }
  }

  async loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Impossible de charger le script: ${src}`));

      document.head.appendChild(script);
    });
  }

async getCurrentLocation(): Promise<void> {
  if (!this.isBrowser) return;

  console.log('➡️ Récupération de la position GPS du livreur...');
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
    console.log('✅ Position GPS récupérée:', this.userLocation);
  } catch (error: any) {
    this.locationError = "Impossible d'obtenir votre position GPS";
    console.error('❌ Erreur géolocalisation:', error);
  } finally {
    this.isLoadingLocation = false;
    console.log('🔹 Fin récupération GPS');
  }
}

async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
  console.log('➡️ Géocodage de l’adresse du client:', address);
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        console.log('✅ Géocodage réussi:', { lat: location.lat(), lng: location.lng() });
        resolve({ latitude: location.lat(), longitude: location.lng() });
      } else {
        console.error('❌ Erreur de géocodage:', status);
        reject('Erreur de géocodage: ' + status);
      }
    });
  });
}


  initGoogleMap(): void {
  console.log('➡️ Initialisation de Google Maps...');
  const mapContainer = document.getElementById('map-container');
  console.log('mapContainer:', mapContainer);
  if (!mapContainer) return console.error('❌ map-container introuvable !');

  const width = mapContainer.offsetWidth;
  const height = mapContainer.offsetHeight;
  console.log('mapContainer size:', { width, height });
  if (width === 0 || height === 0) return console.error('❌ map-container a une taille nulle !');

  this.map = new google.maps.Map(mapContainer, {
    center: { lat: this.userLocation!.latitude, lng: this.userLocation!.longitude },
    zoom: 14
  });
  console.log('✅ Carte Google Maps créée avec succès.');
}


  calculateRoute(): void {
    if (!this.userLocation || !this.clientLocation || !this.map) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route({
      origin: { lat: this.userLocation.latitude, lng: this.userLocation.longitude },
      destination: { lat: this.clientLocation.latitude, lng: this.clientLocation.longitude },
      travelMode: google.maps.TravelMode.DRIVING
    }, (result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);

        if (this.polyline) this.polyline.setMap(null);
        this.polyline = new google.maps.Polyline({
          path: result.routes[0].overview_path,
          strokeColor: '#007bff',
          strokeOpacity: 0.8,
          strokeWeight: 6,
          map: this.map
        });

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
    if (!this.userLocation || !this.clientLocation) return;
    this.speakFrench("Navigation démarrée. Suivez les instructions.");
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

        if (this.courierMarker.setPosition) {
          this.courierMarker.setPosition({ lat: this.userLocation.latitude, lng: this.userLocation.longitude });
        }

        this.map.setCenter({ lat: this.userLocation.latitude, lng: this.userLocation.longitude });
        this.calculateRoute();
        this.checkStepsAndSpeak();

        if (this.getDistance(
          this.userLocation.latitude,
          this.userLocation.longitude,
          this.clientLocation!.latitude,
          this.clientLocation!.longitude
        ) < 20) {
          this.speakFrench("Vous êtes arrivé à destination.");
          this.stopTrackingPosition();
        }
      },
      err => {
        if (err.code === 1) this.locationError = "⚠️ Permission refusée.";
        else if (err.code === 2) this.locationError = "⚠️ Position indisponible.";
        else if (err.code === 3) this.locationError = "⚠️ Temps d’attente dépassé.";
        console.error('Erreur suivi GPS:', err);
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  }

  private checkStepsAndSpeak(): void {
    this.routeSteps.forEach(step => {
      if (!step.end_location) return;
      const stepLat = step.end_location.lat();
      const stepLng = step.end_location.lng();
      const distance = this.getDistance(
        this.userLocation!.latitude,
        this.userLocation!.longitude,
        stepLat,
        stepLng
      );

      if (distance < 30 && !step.spoken) {
        const instruction = step.instructions.replace(/<[^>]+>/g, '');
        this.speakFrench(instruction);
        step.spoken = true;
      }
    });
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
    speechSynthesis.speak(utterance);
  }

  closeModal(): void {
    this.selectedOrder = null;
    this.clientLocation = null;
    this.stopTrackingPosition();

    // Nettoyer la carte Google Maps si elle existe
    if (this.map && this.googleMapsLoader.isGoogleMapsAvailable()) {
      // Supprimer tous les éléments de la carte Google Maps
      this.clientMarker = null;
      this.courierMarker = null;
      this.directionsRenderer = null;
      this.polyline = null;
    }
    // Nettoyer la carte OpenStreetMap si elle existe
    else if (this.map && (window as any).L) {
      try {
        this.map.remove();
      } catch (err) {
        console.error('Erreur lors du nettoyage de la carte OpenStreetMap:', err);
      }
    }

    this.map = null;
    this.routeSteps = [];
    this.spokenInstructions.clear();

    // Ne pas réinitialiser complètement le service Google Maps,
    // car il peut être réutilisé lors d'une prochaine ouverture du modal
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
