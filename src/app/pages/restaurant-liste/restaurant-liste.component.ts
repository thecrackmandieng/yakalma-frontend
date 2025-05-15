import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';

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
      image: "assets/riz.png"
    },
    {
      name: "Chez Mamadou",
      description: "Spécialités sénégalaises et ambiance conviviale.",
      address: "45 Avenue Blaise Diagne, Dakar",
      contact: "76 234 56 78",
      image: "assets/restaurants/mamadou.jpg"
    },
    {
      name: "Pizza Express",
      description: "Pizzas artisanales cuites au feu de bois.",
      address: "8 Rue des Manguiers, Dakar",
      contact: "78 345 67 89",
      image: "assets/restaurants/pizza.jpg"
    },
    {
      name: "La Mer Bleue",
      description: "Poissons et fruits de mer frais, vue sur l’océan.",
      address: "Plage de Ngor, Dakar",
      contact: "70 456 78 90",
      image: "assets/restaurants/merbleue.jpg"
    },
    {
      name: "Tasty Burger",
      description: "Burgers gourmets et frites maison.",
      address: "23 Rue des Almadies, Dakar",
      contact: "75 567 89 01",
      image: "assets/restaurants/burger.jpg"
    },
    {
      name: "Asia Wok",
      description: "Cuisine asiatique variée et savoureuse.",
      address: "17 Avenue Cheikh Anta Diop, Dakar",
      contact: "77 678 90 12",
      image: "assets/restaurants/asiawok.jpg"
    },
    {
      name: "Le Jardin Vert",
      description: "Restaurant végétarien et bio.",
      address: "5 Rue des Jardins, Dakar",
      contact: "76 789 01 23",
      image: "assets/restaurants/jardin.jpg"
    },
    {
      name: "Café du Marché",
      description: "Petit-déjeuner, brunch et pâtisseries maison.",
      address: "Marché Kermel, Dakar",
      contact: "78 890 12 34",
      image: "assets/restaurants/cafe.jpg"
    }
  ];

  onRestaurantClick(_t6: any) {
    throw new Error('Method not implemented.');
  }
}
// ...existing code...
