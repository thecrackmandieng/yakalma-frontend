import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Position } from '../../../services/geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class LivreurNavigationService {
  private currentRouteSubject = new BehaviorSubject<google.maps.DirectionsResult | null>(null);
  private destinationSubject = new BehaviorSubject<DeliveryLocation | null>(null);

  public currentRoute$ = this.currentRouteSubject.asObservable();
  public destination$ = this.destinationSubject.asObservable();

  constructor() {}

  setDestination(location: DeliveryLocation): void {
    this.destinationSubject.next(location);
  }

  calculateRoute(origin: Position, destination: DeliveryLocation): Observable<google.maps.DirectionsResult> {
    return new Observable(observer => {
      if (typeof google !== 'undefined' && google.maps) {
        const directionsService = new google.maps.DirectionsService();

        const request: google.maps.DirectionsRequest = {
          origin: new google.maps.LatLng(origin.latitude, origin.longitude),
          destination: new google.maps.LatLng(destination.latitude, destination.longitude),
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
          avoidHighways: false,
          avoidTolls: false
        };

        directionsService.route(request, (
          result: google.maps.DirectionsResult | null,
          status: google.maps.DirectionsStatus
        ) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            observer.next(result);
            this.currentRouteSubject.next(result);
            observer.complete();
          } else {
            observer.error(status);
          }
        });
      } else {
        observer.error('Google Maps API non disponible');
      }
    });
  }

  getDistanceAndDuration(origin: Position, destination: DeliveryLocation): Observable<{distance: string, duration: string}> {
    return new Observable(observer => {
      if (typeof google !== 'undefined' && google.maps) {
        const service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
          origins: [new google.maps.LatLng(origin.latitude, origin.longitude)],
          destinations: [new google.maps.LatLng(destination.latitude, destination.longitude)],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC
        }, (
          response: google.maps.DistanceMatrixResponse | null,
          status: google.maps.DistanceMatrixStatus
        ) => {
          if (status === google.maps.DistanceMatrixStatus.OK && response && response.rows && response.rows[0] && response.rows[0].elements && response.rows[0].elements[0]) {
            const element = response.rows[0].elements[0];
            if (element.status === 'OK' && element.distance && element.duration) {
              observer.next({
                distance: element.distance.text || 'Distance non disponible',
                duration: element.duration.text || 'Durée non disponible'
              });
            } else {
              observer.next({
                distance: 'Distance non calculable',
                duration: 'Durée non calculable'
              });
            }
            observer.complete();
          } else {
            observer.error(status || 'Erreur lors du calcul de la distance');
          }
        });
      } else {
        observer.error('Google Maps API non disponible');
      }
    });
  }

  startNavigation(): void {
    // Logique pour démarrer la navigation
    console.log('Navigation GPS démarrée');
  }

  stopNavigation(): void {
    // Logique pour arrêter la navigation
    this.currentRouteSubject.next(null);
    this.destinationSubject.next(null);
    console.log('Navigation GPS arrêtée');
  }
}

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  address: string;
}
