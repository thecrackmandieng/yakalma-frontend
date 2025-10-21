import { Component } from '@angular/core';

@Component({
  selector: 'app-client-orders-tracking',
  standalone: true,
  imports: [],
  templateUrl: './client-orders-tracking.component.html',
  styleUrl: './client-orders-tracking.component.css'
})
export class ClientOrdersTrackingComponent {
  // Example fix: if you have a property like this
  // location: google.maps.LatLngLiteral | null = null;

  // Change it to:
  // location: google.maps.LatLngLiteral | undefined = undefined;
}
