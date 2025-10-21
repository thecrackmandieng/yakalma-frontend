import { Injectable } from '@angular/core';
import { GeolocationService, Position } from '../../../services/geolocation.service';
import { TrackingService } from '../../../services/tracking.service';
import { BehaviorSubject } from 'rxjs';

export interface DeliveryLocation {
  clientAddress: string;
  clientCoordinates: Position;
  deliveryInstructions?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LivreurGeolocationService {
  private clientLocation = new BehaviorSubject<DeliveryLocation | null>(null);
  private isTracking = new BehaviorSubject<boolean>(false);

  public clientLocation$ = this.clientLocation.asObservable();
  public isTracking$ = this.isTracking.asObservable();

  constructor(
    private geolocationService: GeolocationService,
    private trackingService: TrackingService
  ) {}

  async getClientLocationFromOrder(order: any): Promise<DeliveryLocation> {
    try {
      const deliveryAddress = order.deliveryAddress || order.shippingAddress;
      
      if (!deliveryAddress) {
        throw new Error('Adresse de livraison non trouvée');
      }

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

  startRealTimeTracking(orderId: string, livreurId: string): void {
    this.isTracking.next(true);
    this.trackingService.startTracking(orderId, livreurId);
  }

  stopRealTimeTracking(orderId: string): void {
    this.isTracking.next(false);
    this.trackingService.stopTracking(orderId);
  }

  calculateDistanceToClient(livreurPosition: Position, clientPosition: Position): number {
    return this.geolocationService.calculateDistance(livreurPosition, clientPosition);
  }

  calculateETA(distanceKm: number): number {
    return this.geolocationService.estimateTravelTime(distanceKm);
  }
}
