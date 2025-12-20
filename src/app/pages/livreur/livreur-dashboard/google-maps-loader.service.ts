import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, TimeoutError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

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
  // Sujet pour savoir si la carte est chargée
  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  public isLoaded$: Observable<boolean> = this.isLoadedSubject.asObservable();

  // Sujet pour gérer les erreurs de chargement
  private loadErrorSubject = new BehaviorSubject<string | null>(null);
  public loadError$: Observable<string | null> = this.loadErrorSubject.asObservable();

  private scriptLoaded = false;
  private scriptLoading = false;
  private scriptLoadPromise: Promise<boolean> | null = null;
  private apiKey = environment.googleMapsApiKey;
  private isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Vérifier si Google Maps est déjà chargé au démarrage
    if (this.isBrowser) {
      this.checkGoogleMapsLoaded();
    }
  }

  /**
   * Vérifie si Google Maps est déjà chargé
   */
  private checkGoogleMapsLoaded(): void {
    if (this.isGoogleMapsAvailable()) {
      this.scriptLoaded = true;
      this.isLoadedSubject.next(true);
    }
  }

  /**
   * Charge l'API Google Maps si elle n'est pas déjà chargée.
   * Retourne une promesse qui se résout à true si tout est OK.
   */
  loadGoogleMaps(maxRetries: number = 2, timeout: number = 15000): Promise<boolean> {
    // Si déjà chargé, retourner immédiatement une promesse résolue
    if (this.scriptLoaded || this.isGoogleMapsAvailable()) {
      this.isLoadedSubject.next(true);
      return Promise.resolve(true);
    }

    // Si déjà en cours de chargement, retourner la promesse existante
    if (this.scriptLoading && this.scriptLoadPromise) {
      return this.scriptLoadPromise;
    }

    // Commencer le chargement
    this.scriptLoading = true;
    this.scriptLoadPromise = this.loadScriptWithRetry(maxRetries, timeout);

    return this.scriptLoadPromise;
  }

  /**
   * Charge le script avec un mécanisme de retry
   */
  private loadScriptWithRetry(maxRetries: number, timeout: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const tryLoadScript = () => {
        attempts++;
        console.log(`🔄 Tentative ${attempts}/${maxRetries} de chargement de Google Maps...`);

        // Vérifier d'abord si Google Maps est déjà disponible
        if (this.isGoogleMapsAvailable()) {
          this.scriptLoaded = true;
          this.isLoadedSubject.next(true);
          this.loadErrorSubject.next(null);
          this.scriptLoading = false;
          resolve(true);
          return;
        }

        // Supprimer l'ancien script s'il existe pour éviter les conflits
        const oldScript = document.getElementById('google-maps-script');
        if (oldScript) {
          oldScript.remove();
          console.log('🗑️ Suppression de l\'ancien script Google Maps');
        }

        // Créer un nouveau script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;
        script.id = 'google-maps-script';

        // Définir le callback global
        (window as any).initGoogleMaps = () => {
          console.log('✅ Google Maps script chargé avec succès');
          this.scriptLoaded = true;
          this.scriptLoading = false;
          this.isLoadedSubject.next(true);
          this.loadErrorSubject.next(null);
          resolve(true);
        };

        // Définir le timeout
        const timeoutId = setTimeout(() => {
          script.remove();
          if (attempts < maxRetries) {
            console.log(`⏱️ Timeout après ${timeout}ms, tentative ${attempts}/${maxRetries}`);
            // Attendre plus longtemps à chaque tentative et un peu plus pour laisser le temps au réseau
            const delay = 2000 * attempts + 3000;
            setTimeout(tryLoadScript, delay);
          } else {
            const errorMessage = `Impossible de charger Google Maps après ${maxRetries} tentatives`;
            this.loadErrorSubject.next(errorMessage);
            console.error(errorMessage);
            this.scriptLoading = false;
            reject(new Error(errorMessage));
          }
        }, timeout);

        // Gérer les erreurs de chargement
        script.onerror = (error) => {
          clearTimeout(timeoutId);
          console.error(`❌ Erreur lors du chargement du script Google Maps:`, error);

          if (attempts < maxRetries) {
            console.log(`🔄 Nouvelle tentative dans ${2000 * attempts + 3000}ms...`);
            // Attendre plus longtemps à chaque tentative et un peu plus pour laisser le temps au réseau
            const delay = 2000 * attempts + 3000;
            setTimeout(tryLoadScript, delay);
          } else {
            const errorMessage = `Impossible de charger Google Maps après ${maxRetries} tentatives`;
            this.loadErrorSubject.next(errorMessage);
            this.scriptLoading = false;
            reject(new Error(errorMessage));
          }
        };

        // Ajouter le nouveau script au document
        document.head.appendChild(script);
      };

      tryLoadScript();
    });
  }

  /**
   * Vérifie si Google Maps est disponible dans window
   */
  isGoogleMapsAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.google !== 'undefined' && !!window.google.maps;
  }

  /**
   * Retourne le message d'erreur le plus récent
   */
  getErrorMessage(): string {
    return this.loadErrorSubject.value || (this.isGoogleMapsAvailable() ? '' : 'Google Maps n\'est pas disponible. Vérifiez votre connexion Internet et votre clé API.');
  }

  /**
   * Réinitialise l'état du service (utile pour les tests ou pour forcer un rechargement)
   */
  reset(): void {
    this.scriptLoaded = false;
    this.scriptLoading = false;
    this.scriptLoadPromise = null;
    this.isLoadedSubject.next(false);
    this.loadErrorSubject.next(null);
  }
}
