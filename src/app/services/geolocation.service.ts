import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, interval } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

export interface Position {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: Position;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private currentPosition = new BehaviorSubject<Position | null>(null);
  private deliveryAddress = new BehaviorSubject<Address | null>(null);
  
  public currentPosition$ = this.currentPosition.asObservable();
  public deliveryAddress$ = this.deliveryAddress.asObservable();

  constructor() {
    this.initializeGeolocation();
  }

  /** 🎯 Demander la géolocalisation du client */
  async requestClientLocation(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Géolocalisation non supportée');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: Position = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          this.currentPosition.next(pos);
          resolve(pos);
        },
        (error) => {
          reject(this.handleGeolocationError(error));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  /** 🚚 Suivi en temps réel du livreur */
  startDeliveryTracking(livreurId: string): Observable<Position> {
    return interval(5000).pipe(
      switchMap(() => from(this.getCurrentPosition())),
      map(position => ({
        ...position,
        livreurId
      }))
    );
  }

  /** 📍 Obtenir la position actuelle */
  private async getCurrentPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: Position = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          resolve(pos);
        },
        (error) => reject(this.handleGeolocationError(error)),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  }

  /** 🏠 Définir l'adresse de livraison */
  setDeliveryAddress(address: Address): void {
    this.deliveryAddress.next(address);
  }

  /** 📤 Obtenir l'adresse depuis les coordonnées */
  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || 'Adresse non trouvée';
    } catch (error) {
      console.error('Erreur géocodage inverse:', error);
      return 'Erreur lors de la récupération de l\'adresse';
    }
  }

  /** ⚡ Initialiser la géolocalisation automatique */
  private initializeGeolocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const pos: Position = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          this.currentPosition.next(pos);
        },
        (error) => console.error('Erreur géolocalisation:', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  }

  /** ❌ Gestion des erreurs de géolocalisation */
  private handleGeolocationError(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Permission refusée pour accéder à la géolocalisation';
      case error.POSITION_UNAVAILABLE:
        return 'Position géographique indisponible';
      case error.TIMEOUT:
        return 'Délai d\'attente dépassé pour la géolocalisation';
      default:
        return 'Erreur de géolocalisation inconnue';
    }
  }

  /** 📏 Calculer la distance entre deux points */
  calculateDistance(pos1: Position, pos2: Position): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
    const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /** ⏱️ Estimer le temps de trajet (approximatif) */
  estimateTravelTime(distanceKm: number, averageSpeedKph: number = 30): number {
    return (distanceKm / averageSpeedKph) * 60; // en minutes
  }
}
