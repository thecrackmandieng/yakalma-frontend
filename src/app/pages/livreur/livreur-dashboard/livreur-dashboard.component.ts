import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeaderLivreurComponent } from "../../header-livreur/header-livreur.component";
import { FooterComponent } from "../../footer/footer.component";
import { CommonModule } from '@angular/common';
import { GoogleMap } from '@angular/google-maps';
import { PartenaireService, Order as BaseOrder } from '../../../services/partenaire.service';

type Order = BaseOrder & {
  image?: string;
  center?: { lat: number; lng: number };
};

@Component({
  selector: 'app-livreur-dashboard',
  standalone: true,
  imports: [HeaderLivreurComponent, FooterComponent, CommonModule, GoogleMap],
  templateUrl: './livreur-dashboard.component.html',
  styleUrls: ['./livreur-dashboard.component.css']
})
export class LivreurDashboardComponent implements OnInit {

  isBrowser: boolean;
  selectedOrder: Order | null = null;
  orders: Order[] = [];

  constructor(
    private partenaireService: PartenaireService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadDeliveredOrders();
  }

  /** 🔄 Charger toutes les commandes livrées */
  loadDeliveredOrders(): void {
    this.partenaireService.getDeliveredOrders().subscribe({
      next: (orders) => {
        this.orders = orders.map(order => ({
          ...order,
          image: this.getImageUrl(order),
          center: this.getDefaultMapCenter()
        }));
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des commandes livrées :', err);
      }
    });
  }

  /** ✅ Le livreur accepte la commande (devient en_cours) */
 // ➜ remplacer l’appel à acceptOrder par assignOrderToCourier
acceptOrder(order: Order): void {
  if (order.status === 'livre') {
    this.partenaireService.assignOrderToCourier(order._id!).subscribe({
      next: updated => {
        order.status = updated.status;        // passe à 'en_cours'
        order.courierId = updated.courierId;  // pour info
        // grisé + désactivation via le template / CSS
        this.selectedOrder = {
          ...updated,
          image: this.getImageUrl(updated),
          center: this.getDefaultMapCenter()
        };
      },
      error: err => console.error('Erreur assignation :', err)
    });
  }
}


  /** ❌ Fermer la modal */
  closeModal(): void {
    this.selectedOrder = null;
  }

  /** Afficher la carte sans changer le statut */
  showMap(order: Order): void {
    this.selectedOrder = {
      ...order,
      center: this.getDefaultMapCenter()
    };
  }

  /** 📸 Image du premier article */
  getImageUrl(order: Order): string {
    const firstItem = order.items?.[0];
    if (firstItem?.image) {
      const imagePath = firstItem.image;
      if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
        return imagePath;
      }
      return `http://localhost:3000/${imagePath}`;
    }
    return 'assets/riz.png';
  }

  /** 🗺️ Position par défaut (Dakar) */
  getDefaultMapCenter(): { lat: number; lng: number } {
    return { lat: 14.6928, lng: -17.4467 };
  }
}
