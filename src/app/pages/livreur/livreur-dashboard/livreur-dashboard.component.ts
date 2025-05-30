import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeaderLivreurComponent } from "../../header-livreur/header-livreur.component";
import { FooterComponent } from "../../footer/footer.component";
import { CommonModule } from '@angular/common';
import { GoogleMap } from '@angular/google-maps';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-livreur-dashboard',
  standalone: true,
  imports: [HeaderLivreurComponent, FooterComponent, CommonModule, GoogleMap],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './livreur-dashboard.component.html',
  styleUrls: ['./livreur-dashboard.component.css']
})
export class LivreurDashboardComponent {

  private isBrowser: boolean;
  selectedOrder: any = null;

  orders = [
    {
      id: 1,
      customerName: "Fatou Ndiaye",
      address: "12 Rue de Paris, Dakar",
      contact: "77 123 45 67",
      image: "assets/riz.png",
      status: 'non livré',
      items: [
        { name: "Poulet Yassa", quantity: 2 },
        { name: "Bissap", quantity: 2 }
      ],
      center: { lat: 14.7167, lng: -17.4677 }
    },
    {
      id: 2,
      customerName: "Mamadou Ba",
      address: "45 Avenue Cheikh Anta Diop, Dakar",
      contact: "77 234 56 78",
      image: "assets/pizza.avif",
      status: 'non livré',
      items: [
        { name: "Mafé", quantity: 1 },
        { name: "Jus de Gingembre", quantity: 1 }
      ],
      center: { lat: 14.6928, lng: -17.4467 }
    },
    {
      id: 3,
      customerName: "Aminata Sow",
      address: "8 Rue des Jardins, Pikine",
      contact: "77 345 67 89",
      image: "assets/poisson.jpg",
      status: 'non livré',
      items: [
        { name: "Thieboudienne", quantity: 3 }
      ],
      center: { lat: 14.7645, lng: -17.3756 }
    },
    {
      id: 4,
      customerName: "Ibrahima Diallo",
      address: "23 Boulevard de la République, Dakar",
      contact: "77 456 78 90",
      image: "assets/salade.jpeg",
      status: 'non livré',
      items: [
        { name: "Yassa Poisson", quantity: 2 },
        { name: "Sobo", quantity: 2 }
      ],
      center: { lat: 14.6700, lng: -17.4390 }
    },
    {
      id: 5,
      customerName: "Khady Diop",
      address: "17 Rue Blaise Diagne, Rufisque",
      contact: "77 567 89 01",
      image: "assets/yassa.webp",
      status: 'non livré',
      items: [
        { name: "Mafé", quantity: 2 },
        { name: "Bouye", quantity: 1 }
      ],
      center: { lat: 14.7156, lng: -17.2736 }
    },
    {
      id: 6,
      customerName: "Cheikh Faye",
      address: "30 Rue de la Corniche, Guédiawaye",
      contact: "77 678 90 12",
      image: "assets/griade.webp",
      status: 'non livré',
      items: [
        { name: "Thiebou Yapp", quantity: 1 },
        { name: "Bissap", quantity: 1 }
      ],
      center: { lat: 14.7900, lng: -17.4000 }
    }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  acceptOrder(order: any) {
    if (this.isBrowser) {
      order.status = 'livré';
      this.selectedOrder = order;
    }
  }

  closeModal() {
    this.selectedOrder = null;
  }
}
