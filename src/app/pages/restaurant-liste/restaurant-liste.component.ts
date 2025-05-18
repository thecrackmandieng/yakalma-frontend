import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-liste',
  standalone: true,
  imports: [FooterComponent, HeaderComponent,CommonModule],
  templateUrl: './restaurant-liste.component.html',
  styleUrl: './restaurant-liste.component.css'
})
// ...existing code...
export class RestaurantListeComponent {
  restaurants = [
    {
      name: "Le Gourmet",
      description: "Cuisine française raffinée dans un cadre élégant.",
      address: "12 Rue de Paris, Dakar",
      contact: "77 123 45 67",
      image: "assets/goumet.jpeg"
    },
    {
      name: "Chez Mamadou",
      description: "Spécialités sénégalaises et ambiance conviviale.",
      address: "45 Avenue Blaise Diagne, Dakar",
      contact: "76 234 56 78",
      image: "assets/mamadou.jpg"
    },
    {
      name: "Pizza Express",
      description: "Pizzas artisanales cuites au feu de bois.",
      address: "8 Rue des Manguiers, Dakar",
      contact: "78 345 67 89",
      image: "assets/pizza.avif"
    },
    {
      name: "La Mer Bleue",
      description: "Poissons et fruits de mer frais, vue sur l’océan.",
      address: "Plage de Ngor, Dakar",
      contact: "70 456 78 90",
      image: "assets/merbleu.jpg"
    },
    {
      name: "Tasty Burger",
      description: "Burgers gourmets et frites maison.",
      address: "23 Rue des Almadies, Dakar",
      contact: "75 567 89 01",
      image: "assets/burger.avif"
    },
    {
      name: "Asia Wok",
      description: "Cuisine asiatique variée et savoureuse.",
      address: "17 Avenue Cheikh Anta Diop, Dakar",
      contact: "77 678 90 12",
      image: "assets/asia.jpg"
    },
    {
      name: "Le Jardin Vert",
      description: "Restaurant végétarien et bio.",
      address: "5 Rue des Jardins, Dakar",
      contact: "76 789 01 23",
      image: "assets/jardin.webp"
    },
    {
      name: "Café du Marché",
      description: "Petit-déjeuner, brunch et pâtisseries maison.",
      address: "Marché Kermel, Dakar",
      contact: "78 890 12 34",
      image: "assets/cafe.jpeg"
    }
  ];
  constructor(private router: Router) {}

  onRestaurantClick(restaurant: any) {
    if (restaurant.name === "Café du Marché") {
      this.router.navigate(['restaurant/dashboard']);
    }
  }
}
// ...existing code...
