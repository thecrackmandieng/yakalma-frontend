import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare global {
  interface Window {
    L: any; // Leaflet
  }
}

@Injectable({
  providedIn: 'root'
})
export class OpenStreetMapLoaderService {
  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  private loadErrorSubject = new BehaviorSubject<string | null>(null);

  public isLoaded$ = this.isLoadedSubject.asObservable();
  public loadError$ = this.loadErrorSubject.asObservable();

  private scriptLoaded = false;

  loadOpenStreetMap(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded || typeof window.L !== 'undefined') {
        this.isLoadedSubject.next(true);
        resolve(true);
        return;
      }

      // Load Leaflet CSS
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);

      // Load Leaflet JS
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletScript.async = true;

      leafletScript.onload = () => {
        this.scriptLoaded = true;
        this.isLoadedSubject.next(true);
        this.loadErrorSubject.next(null);
        resolve(true);
      };

      leafletScript.onerror = (error) => {
        const errorMessage = 'Erreur lors du chargement de la carte OpenStreetMap';
        this.loadErrorSubject.next(errorMessage);
        console.error('OpenStreetMap/Leaflet failed to load:', error);
        reject(new Error(errorMessage));
      };

      document.head.appendChild(leafletScript);
    });
  }

  isOpenStreetMapAvailable(): boolean {
    return typeof window.L !== 'undefined';
  }

  getErrorMessage(): string {
    if (!this.isOpenStreetMapAvailable()) {
      return 'La carte OpenStreetMap n\'est pas disponible. Vérifiez votre connexion Internet.';
    }
    return '';
  }
}
