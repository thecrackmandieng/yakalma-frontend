import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { Observable, Subscription } from 'rxjs';
import { Position } from '../../services/geolocation.service';
import { TrackingData } from '../../services/tracking.service';

@Component({
  selector: 'app-tracking-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  template: `
    <div *ngIf="isBrowser" class="tracking-container">
      <google-map
        [center]="mapCenter"
        [zoom]="zoom"
        [options]="mapOptions"
        class="tracking-map">

        <!-- Position du client -->
        <map-marker
          *ngIf="clientPosition"
          [position]="clientPosition"
          [options]="clientMarkerOptions">
        </map-marker>

        <!-- Position du livreur -->
        <map-marker
          *ngIf="livreurPosition"
          [position]="livreurPosition"
          [options]="livreurMarkerOptions">
        </map-marker>

        <!-- Trajet -->
        <map-polyline
          *ngIf="routePath.length > 0"
          [path]="routePath"
          [options]="routeOptions">
        </map-polyline>

      </google-map>

      <div class="tracking-info" *ngIf="showInfo">
        <div class="info-card">
          <h4>📍 Position actuelle</h4>
          <p *ngIf="clientPosition">
            Client: {{ clientPosition.lat | number:'1.4-4' }}, {{ clientPosition.lng | number:'1.4-4' }}
          </p>
          <p *ngIf="livreurPosition">
            Livreur: {{ livreurPosition.lat | number:'1.4-4' }}, {{ livreurPosition.lng | number:'1.4-4' }}
          </p>
          <p *ngIf="distance">
            Distance: {{ distance | number:'1.2-2' }} km
          </p>
          <p *ngIf="eta">
            ETA: {{ eta }} minutes
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracking-container {
      width: 100%;
      height: 400px;
      position: relative;
    }

    .tracking-map {
      width: 100%;
      height: 100%;
    }

    .tracking-info {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 1000;
    }

    .info-card {
      background: white;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      max-width: 250px;
    }

    .info-card h4 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .info-card p {
      margin: 4px 0;
      font-size: 12px;
      color: #666;
    }
  `]
})
export class TrackingMapComponent implements OnInit, OnDestroy {
  @Input() clientPosition?: google.maps.LatLngLiteral;
  @Input() livreurPosition?: google.maps.LatLngLiteral;
  @Input() showInfo = true;
  @Input() zoom = 15;

  isBrowser: boolean = false;

  mapCenter: google.maps.LatLngLiteral = { lat: 14.6928, lng: -17.4467 };
  mapOptions: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 8,
  };

  clientMarkerOptions: google.maps.MarkerOptions = {
    icon: {
      url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      scaledSize: new google.maps.Size(40, 40)
    },
    title: 'Position du client'
  };

  livreurMarkerOptions: google.maps.MarkerOptions = {
    icon: {
      url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      scaledSize: new google.maps.Size(40, 40)
    },
    title: 'Position du livreur'
  };

  routeOptions: google.maps.PolylineOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 3
  };

  routePath: google.maps.LatLngLiteral[] = [];
  distance?: number;
  eta?: number;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.updateMapCenter();
  }

  ngOnDestroy(): void {
    // Nettoyage si nécessaire
  }

  private updateMapCenter(): void {
    if (this.clientPosition) {
      this.mapCenter = this.clientPosition;
    } else if (this.livreurPosition) {
      this.mapCenter = this.livreurPosition;
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

  /** 🔄 Mettre à jour la carte avec les nouvelles positions */
  updatePositions(clientPos?: Position, livreurPos?: Position): void {
    if (clientPos) {
      this.clientPosition = {
        lat: clientPos.latitude,
        lng: clientPos.longitude
      };
    }

    if (livreurPos) {
      this.livreurPosition = {
        lat: livreurPos.latitude,
        lng: livreurPos.longitude
      };
    }

    if (clientPos && livreurPos) {
      this.distance = this.calculateDistance(clientPos, livreurPos);
      this.eta = Math.round(this.distance * 2); // Estimation simple: 2 min par km

      // Créer le trajet
      this.routePath = [
        { lat: livreurPos.latitude, lng: livreurPos.longitude },
        { lat: clientPos.latitude, lng: clientPos.longitude }
      ];
    }

    this.updateMapCenter();
  }
}
