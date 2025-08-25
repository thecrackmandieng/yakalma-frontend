import { Component, OnInit } from '@angular/core';
import { Partenaire } from '../models/partenaire.model';
import { PartenaireService } from '../../services/partenaire.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-restaurant-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-restaurant-list.component.html',
  styleUrl: './section-restaurant-list.component.css'
})
export class SectionRestaurantListComponent implements OnInit {
  restaurants: Partenaire[] = [];

  constructor(
    private partenaireService: PartenaireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.partenaireService.getPartenaires().subscribe({
      next: (data) => {
        // console.log('Restaurants chargés :', data); // pour debug
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
