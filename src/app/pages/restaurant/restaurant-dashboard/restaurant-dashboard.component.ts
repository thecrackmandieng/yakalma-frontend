import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderRestaurantComponent } from '../../header-restaurant/header-restaurant.component';
import { PartenaireService } from '../../../services/partenaire.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-restaurant-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderRestaurantComponent, FooterComponent],
  templateUrl: './restaurant-dashboard.component.html',
  styleUrls: ['./restaurant-dashboard.component.css']
})
export class RestaurantDashboardComponent implements OnInit {
  restaurantName: string = '';
  backgroundImage: string = "url('/assets/partb.png')";
  private backendUrl = environment.apiUrl;
  private isBrowser: boolean;

  constructor(
    private partenaireService: PartenaireService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.partenaireService.getRestaurantProfile().subscribe({
        next: (res) => {
          this.restaurantName = res.restaurant.name;

          if (res.restaurant.photo) {
            const photoPath = res.restaurant.photo.startsWith('http')
              ? res.restaurant.photo
              : `${this.backendUrl}${res.restaurant.photo.startsWith('/') ? '' : '/'}${res.restaurant.photo}`;
            this.backgroundImage = `url('${photoPath}')`;
          }
        },
        error: () => {
          this.restaurantName = 'Votre Restaurant';
        }
      });
    }
  }
}
