import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PartenaireService } from '../../services/partenaire.service';
import { Partenaire } from '../../pages/models/partenaire.model';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-restaurant-liste',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './restaurant-liste.component.html',
  styleUrl: './restaurant-liste.component.css'
})
export class RestaurantListeComponent implements OnInit {
  restaurants: Partenaire[] = [];

  constructor(
    private partenaireService: PartenaireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.partenaireService.getPartenaires().subscribe({
      next: (data) => {
        console.log('Restaurants chargés :', data); // pour debug
        this.restaurants = data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des restaurants :", err);
      }
    });
  }

onRestaurantClick(restaurant: Partenaire): void {
  if (restaurant._id) {
    this.router.navigate(['/restaurant', restaurant._id, 'menu']);
  }
}



  getImageUrl(restaurant: Partenaire): string {
    if (!restaurant.photo) {
      return 'assets/riz.jpg'; // Image par défaut si non définie
    }

    // Si l'image est déjà une URL complète
    if (restaurant.photo.startsWith('http')) {
      return restaurant.photo;
    }

    // Sinon, on concatène l'URL de base du backend avec le chemin relatif
    return `https://yakalma.onrender.com/${restaurant.photo}`;
  }
}
