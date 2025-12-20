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
      // Créer un AbortController pour le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout

      // Utiliser BigDataCloud API pour une meilleure fiabilité
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      const data = await response.json();

      // Construire une adresse formatée à partir des composants
      const addressParts: string[] = [];

      if (data.locality) addressParts.push(data.locality);
      if (data.city) addressParts.push(data.city);
      if (data.principalSubdivision) addressParts.push(data.principalSubdivision);
      if (data.countryName) addressParts.push(data.countryName);

      if (addressParts.length > 0) {
        const formattedAddress = addressParts.join(', ');
        console.log('✅ Adresse récupérée avec BigDataCloud:', formattedAddress);
        return formattedAddress;
      }

      // Fallback vers Nominatim si BigDataCloud ne donne pas de résultats
      console.warn('⚠️ BigDataCloud n\'a pas donné de résultats, utilisation de Nominatim...');

      // Nouveau timeout pour Nominatim
      const nominatimController = new AbortController();
      const nominatimTimeoutId = setTimeout(() => nominatimController.abort(), 10000);

      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        { signal: nominatimController.signal }
      );
      clearTimeout(nominatimTimeoutId);

      const nominatimData = await nominatimResponse.json();

      if (nominatimData.display_name) {
        console.log('✅ Adresse récupérée avec Nominatim:', nominatimData.display_name);
        return nominatimData.display_name;
      }

      return 'Adresse non trouvée, veuillez saisir manuellement';
    } catch (error: any) {
      console.error('Erreur géocodage inverse:', error);
      if (error.name === 'AbortError') {
        return 'Timeout lors de la récupération de l\'adresse, veuillez saisir manuellement';
      }
      return 'Erreur lors de la récupération de l\'adresse, veuillez saisir manuellement';
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
