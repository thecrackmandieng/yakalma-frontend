import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderRestaurantComponent } from '../../header-restaurant/header-restaurant.component';
import { PartenaireService } from '../../../services/partenaire.service';

@Component({
  selector: 'app-restaurant-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderRestaurantComponent,
    FooterComponent
  ],
  templateUrl: './restaurant-dashboard.component.html',
  styleUrl: './restaurant-dashboard.component.css'
})
export class RestaurantDashboardComponent implements OnInit {
  restaurantName: string = '';
  backgroundImage: string = "url('/assets/partb.png')"; // image par défaut

  // URL de base backend (adapter si nécessaire)
  private backendUrl = 'https://yakalma.onrender.com';

  constructor(private partenaireService: PartenaireService) {}

  ngOnInit(): void {
    this.partenaireService.getRestaurantProfile().subscribe({
      next: (res) => {
        this.restaurantName = res.restaurant.name;

        if (res.restaurant.photo) {
          // Si le chemin est relatif (ex: '/uploads/photo-xxx.jpg'), on concatène l'URL backend
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
