import { Component } from '@angular/core';
import { HeaderRestaurantComponent } from "../../header-restaurant/header-restaurant.component";
import { FooterComponent } from "../../footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurant-menu-management',
  standalone: true,
  imports: [HeaderRestaurantComponent, FooterComponent, CommonModule],
  templateUrl: './restaurant-menu-management.component.html',
  styleUrls: ['./restaurant-menu-management.component.css'],

})
// ...existing code...
export class RestaurantMenuManagementComponent {
  orders = [
    {
      id: 1,
      customerName: "Fatou Ndiaye",
      address: "12 Rue de Paris, Dakar",
      contact: "77 123 45 67",
      image: "assets/riz.png",
      items: [
        { name: "Poulet Yassa", quantity: 2 },
        { name: "Bissap", quantity: 2 }
      ]
    },
    {
      id: 2,
      customerName: "Mamadou Diop",
      address: "45 Avenue Blaise Diagne, Dakar",
      contact: "76 234 56 78",
      image: "assets/bissap.webp",
      items: [
        { name: "Thieboudienne", quantity: 1 },
        { name: "Jus de Gingembre", quantity: 1 }
      ]
    },
    {
      id: 3,
      customerName: "Awa Ba",
      address: "8 Rue des Manguiers, Dakar",
      contact: "78 345 67 89",
      image: "assets/pizzaa.jpg",
      items: [
        { name: "Pizza Margherita", quantity: 1 },
        { name: "Soda", quantity: 2 }
      ]
    },
    {
      id: 4,
      customerName: "Ibrahima Sow",
      address: "Plage de Ngor, Dakar",
      contact: "70 456 78 90",
      image: "assets/dieune.webp",
      items: [
        { name: "Poisson Grillé", quantity: 2 },
        { name: "Eau Minérale", quantity: 2 }
      ]
    },
    {
      id: 5,
      customerName: "Seynabou Fall",
      address: "23 Rue des Almadies, Dakar",
      contact: "75 567 89 01",
      image: "assets/yassa.webp",
      items: [
        { name: "Burger Maison", quantity: 1 },
        { name: "Frites", quantity: 1 }
      ]
    },
    {
      id: 6,
      customerName: "Cheikh Kane",
      address: "17 Avenue Cheikh Anta Diop, Dakar",
      contact: "77 678 90 12",
      image: "assets/griade.webp",
      items: [
        { name: "Riz Cantonais", quantity: 2 },
        { name: "Thé Vert", quantity: 2 }
      ]
    },
    {
      id: 7,
      customerName: "Mariama Diallo",
      address: "5 Rue des Jardins, Dakar",
      contact: "76 789 01 23",
      image: "assets/salade.jpeg",
      items: [
        { name: "Salade Végétarienne", quantity: 1 },
        { name: "Smoothie", quantity: 1 }
      ]
    },
    {
      id: 8,
      customerName: "Ousmane Gueye",
      address: "Marché Kermel, Dakar",
      contact: "78 890 12 34",
      image: "assets/croissant.jpeg",
      items: [
        { name: "Croissant", quantity: 3 },
        { name: "Café", quantity: 2 }
      ]
    }
  ];

  acceptOrder(order: any) {
    alert(`Commande #${order.id} acceptée !`);
  }
}
// ...existing code...
