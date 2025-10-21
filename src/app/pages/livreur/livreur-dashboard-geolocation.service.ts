import { Injectable } from '@angular/core';
import { GeolocationService, Position } from '../../../services/geolocation.service';
import { TrackingService } from '../../../services/tracking.service';
import { Observable, BehaviorSubject } from 'rxjs';

export interface DeliveryLocation {
  clientAddress: string;
  clientCoordinates: Position;
  deliveryInstructions?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LivreurDashboardGeolocationService {
  private clientLocation = new BehaviorSubject<DeliveryLocation | null>(null);
  private isTracking = new BehaviorSubject<boolean>(false);

  public clientLocation$ = this.clientLocation.asObservable();
  public isTracking$ = this.isTracking.asObservable();

  constructor(
    private geolocationService: GeolocationService,
    private trackingService: TrackingService
  ) {}

  /** 🎯 Obtenir la localisation du client depuis une commande */
  async getClientLocationFromOrder(order: any): Promise<DeliveryLocation> {
    try {
      // Extraire l'adresse de livraison depuis la commande
      const deliveryAddress = order.deliveryAddress || order.shippingAddress;
      
      if (!deliveryAddress) {
        throw new Error('Adresse de livraison non trouvée');
      }

      // Géocoder l'adresse
      const coordinates = await this.geocodeAddress(deliveryAddress);
      
      const location: DeliveryLocation = {
        clientAddress: deliveryAddress,
        clientCoordinates: coordinates,
        deliveryInstructions: order.deliveryInstructions
      };

      this.clientLocation.next(location);
      return location;
    } catch (error) {
      console.error('Erreur lors de la récupération de la localisation client:', error);
      throw error;
    }
  }

  /** 🗺️ Géocoder une adresse en coordonnées */
  private async geocodeAddress(address: string): Promise<Position> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          accuracy: 50
        };
      }
      
      throw new Error('Adresse non trouvée');
    } catch (error) {
      console.error('Erreur géocodage:', error);
      throw error;
    }
  }

  /** 🚚 Démarrer le suivi en temps réel */
  startRealTimeTracking(orderId: string, livreurId: string): void {
    this.isTracking.next(true);
    
    // Démarrer le suivi via WebSocket
    this.trackingService.startTracking(orderId, livreurId);
    
    // Envoyer la position toutes les 5 secondes
    const trackingInterval = setInterval(async () => {
      try {
        const position = await this.geolocationService.requestClientLocation();
        this.trackingService.updateLivreurPosition(orderId, livreurId, position);
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la position:', error);
      }
    }, 5000);

    // Arrêter le suivi quand demandé
    this.isTracking$.subscribe(isTracking => {
      if (!isTracking) {
        clearInterval(trackingInterval);
        this.trackingService.stopTracking(orderId);
      }
    });
  }

  /** ⏹️ Arrêter le suivi */
  stopRealTimeTracking(orderId: string): void {
    this.isTracking.next(false);
    this.trackingService.stopTracking(orderId);
  }

  /** 📍 Obtenir la distance jusqu'au client */
  calculateDistanceToClient(livreurPosition: Position): number | null {
    const clientLocation = this.clientLocation.value;
    if (!clientLocation) return null;

    return this.geolocationService.calculateDistance(
      livreurPosition,
      clientLocation.clientCoordinates
    );
  }

  /** ⏱️ Estimer le temps d'arrivée */
  calculateETA(distanceKm: number): number {
    return this.geolocationService.estimateTravelTime(distanceKm);
  }
}
