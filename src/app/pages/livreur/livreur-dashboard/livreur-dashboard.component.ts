import { Component, Inject, OnInit, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeaderLivreurComponent } from "../../header-livreur/header-livreur.component";
import { FooterComponent } from "../../footer/footer.component";
import { CommonModule } from '@angular/common';
import { PartenaireService, Order as BaseOrder } from '../../../services/partenaire.service';
import { GeolocationService, Position } from '../../../services/geolocation.service';
import { LivreurGeolocationService, DeliveryLocation } from './livreur-geolocation.service';
import { TrackingService } from '../../../services/tracking.service';
import { LivreurNavigationService, DeliveryLocation as NavDeliveryLocation } from './livreur-navigation.service';

type Order = BaseOrder & {
  image?: string;
  center?: { lat: number; lng: number };
  clientLocation?: DeliveryLocation;
  livreurPosition?: Position;
  distance?: number;
  eta?: number;
  routeInfo?: {
    distance: string;
    duration: string;
  };
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
  userLocation: Position | null = null;
  isLoadingLocation = false;
  locationError: string | null = null;
  map: any = null; // Leaflet map instance

  constructor(
    private partenaireService: PartenaireService,
    private geolocationService: LivreurGeolocationService,
    private trackingService: TrackingService,
    private navigationService: LivreurNavigationService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadDeliveredOrders();
  }

  /** 🔄 Charger toutes les commandes livrées */
  loadDeliveredOrders(): void {
    this.partenaireService.getDeliveredOrders().subscribe({
      next: (orders) => {
        this.orders = orders.map(order => ({
          ...order,
          image: this.getImageUrl(order),
          center: this.getDefaultMapCenter()
        }));
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des commandes livrées :', err);
      }
    });
  }

  /** ✅ Le livreur accepte la commande (devient en_cours) */
 // ➜ remplacer l’appel à acceptOrder par assignOrderToCourier
acceptOrder(order: Order): void {
  if (order.status === 'livre') {
    this.partenaireService.assignOrderToCourier(order._id!).subscribe({
      next: updated => {
        order.status = updated.status;        // passe à 'en_cours'
        order.courierId = updated.courierId;  // pour info
        // grisé + désactivation via le template / CSS
        this.selectedOrder = {
          ...updated,
          image: this.getImageUrl(updated),
          center: this.getDefaultMapCenter()
        };
      },
      error: err => console.error('Erreur assignation :', err)
    });
  }
}


  /** ❌ Fermer la modal */
  closeModal(): void {
    this.selectedOrder = null;
    this.navigationService.stopNavigation();

    // Nettoyer la carte
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  /** Afficher la carte avec navigation GPS */
  showMap(order: Order): void {
    this.selectedOrder = {
      ...order,
      center: this.getDefaultMapCenter()
    };

    // Calculer la route et les informations de navigation
    this.calculateRoute(order);
  }

  /** 🗺️ Calculer la route vers le client */
  calculateRoute(order: Order): void {
    if (!this.userLocation) {
      this.getCurrentLocation().then(() => {
        this.calculateRouteToClient(order);
      });
    } else {
      this.calculateRouteToClient(order);
    }
  }

  private calculateRouteToClient(order: Order): void {
    if (!this.userLocation || !order.address) return;

    // Utiliser des coordonnées par défaut pour Dakar
    const clientLocation: NavDeliveryLocation = {
      latitude: 14.6928,
      longitude: -17.4467,
      address: order.address
    };

    this.navigationService.getDistanceAndDuration(this.userLocation, clientLocation).subscribe({
      next: (routeInfo) => {
        if (this.selectedOrder) {
          this.selectedOrder.routeInfo = routeInfo;
        }
      },
      error: (error) => {
        console.error('Erreur lors du calcul de la route:', error);
      }
    });
  }

  /** 📍 Obtenir la position actuelle du livreur */
  async getCurrentLocation(): Promise<void> {
    if (!this.isBrowser) return;

    this.isLoadingLocation = true;
    this.locationError = null;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      this.userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      this.locationError = 'Impossible d\'obtenir votre position GPS';
      console.error('Erreur géolocalisation:', error);
    } finally {
      this.isLoadingLocation = false;
    }
  }

  /** 🚀 Démarrer la navigation GPS */
  startNavigation(order: Order): void {
    if (!this.userLocation || !order.address) {
      console.error('Position ou adresse manquante');
      return;
    }

    const clientLocation: NavDeliveryLocation = {
      latitude: 14.6928,
      longitude: -17.4467,
      address: order.address
    };

    this.navigationService.setDestination(clientLocation);
    this.navigationService.startNavigation();

    // Mettre à jour le statut de la commande
    this.updateOrderStatus(order, 'en_cours');
  }

  /** 🔄 Mettre à jour le statut de la commande */
  updateOrderStatus(order: Order, newStatus: 'en_attente' | 'en_cours' | 'livre'): void {
    // Utiliser le service assignOrderToCourier pour changer le statut
    if (newStatus === 'en_cours') {
      this.partenaireService.assignOrderToCourier(order._id!).subscribe({
        next: (updatedOrder) => {
          order.status = updatedOrder.status;
          console.log(`Commande ${order._id} mise à jour: ${newStatus}`);
        },
        error: (error) => {
          console.error('Erreur mise à jour statut:', error);
        }
      });
    }
  }

  /** 📸 Image du premier article */
  getImageUrl(order: Order): string {
    const firstItem = order.items?.[0];
    if (firstItem?.image) {
      const imagePath = firstItem.image;
      if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
        return imagePath;
      }
      return `https://yakalma.onrender.com/${imagePath}`;
    }
    return 'assets/riz.png';
  }

  /** 🗺️ Position par défaut (Dakar) */
  getDefaultMapCenter(): { lat: number; lng: number } {
    return { lat: 14.6928, lng: -17.4467 };
  }
}
