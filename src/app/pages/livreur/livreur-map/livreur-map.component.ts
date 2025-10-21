import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-livreur-map',
  standalone: true,
  imports: [],
  templateUrl: './livreur-map.component.html',
  styleUrl: './livreur-map.component.css'
})
export class LivreurMapComponent implements OnInit {
  isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      // Browser-specific initialization can go here
      console.log('LivreurMapComponent initialized in browser');
    } else {
      console.log('LivreurMapComponent initialized on server');
    }
  }
}
