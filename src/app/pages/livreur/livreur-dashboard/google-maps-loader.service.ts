import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  private loadErrorSubject = new BehaviorSubject<string | null>(null);

  public isLoaded$ = this.isLoadedSubject.asObservable();
  public loadError$ = this.loadErrorSubject.asObservable();

  private apiKey = environment.googleMapsApiKey;
  private scriptLoaded = false;

  loadGoogleMaps(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded || typeof window.google !== 'undefined') {
        this.isLoadedSubject.next(true);
        resolve(true);
        return;
      }

      // Créer le script Google Maps
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.scriptLoaded = true;
        this.isLoadedSubject.next(true);
        this.loadErrorSubject.next(null);
        resolve(true);
      };

      script.onerror = (error) => {
        const errorMessage = 'Erreur lors du chargement de Google Maps';
        this.loadErrorSubject.next(errorMessage);
        console.error('Google Maps API failed to load:', error);
        reject(new Error(errorMessage));
      };

      document.head.appendChild(script);
    });
  }

  isGoogleMapsAvailable(): boolean {
    return typeof window.google !== 'undefined' && window.google.maps;
  }

  getErrorMessage(): string {
    if (!this.isGoogleMapsAvailable()) {
      return 'Google Maps n\'est pas disponible. Vérifiez votre connexion Internet et votre clé API.';
    }
    return '';
  }
}
