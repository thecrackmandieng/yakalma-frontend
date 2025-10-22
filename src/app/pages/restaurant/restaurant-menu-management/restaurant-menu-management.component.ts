import { Component, OnInit } from '@angular/core';
import { HeaderRestaurantComponent } from '../../header-restaurant/header-restaurant.component';
import { FooterComponent } from '../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { PartenaireService, Order } from '../../../services/partenaire.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-restaurant-menu-management',
  standalone: true,
  imports: [HeaderRestaurantComponent, FooterComponent, CommonModule],
  templateUrl: './restaurant-menu-management.component.html',
  styleUrls: ['./restaurant-menu-management.component.css'],
})
export class RestaurantMenuManagementComponent implements OnInit {
  showSuccessModal = false;
  currentOrderId: string | null = null;
  orders: Order[] = [];

  constructor(private partenaireService: PartenaireService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Charge la liste des commandes depuis le service
loadOrders(): void {
  this.partenaireService.getMyOrders().subscribe({
    next: (orders: Order[]) => {
      console.log('Orders dans le composant:', orders);
      this.orders = orders;
    },
    error: (err: any) => {
      console.error('❌ Erreur lors du chargement des commandes :', err);
    },
  });
}


  // Accepter une commande
  acceptOrder(order: Order): void {
    if (order.status === 'en_attente' && order._id) {
      this.partenaireService.acceptOrder(order._id).subscribe({
        next: () => {
          order.status = 'en_cours';
          this.loadOrders(); // Recharge la liste après acceptation
        },
        error: (err: any) => {
          console.error('Erreur acceptation commande :', err);
        },
      });
    }
  }

  // Marquer une commande comme livrée
  deliverOrder(order: Order): void {
    if (order.status === 'en_cours' && order._id) {
      this.partenaireService.deliverOrder(order._id).subscribe({
        next: (updatedOrder: Order) => {
          order.status = 'livre';
          this.currentOrderId = updatedOrder._id || null;
          this.showSuccessModal = true;
          this.loadOrders(); // Recharge la liste après livraison
          setTimeout(() => this.closeSuccessModal(), 2000); // Ferme modal automatiquement après 2 secondes
        },
        error: (err: any) => {
          console.error('Erreur livraison commande :', err);
        },
      });
    }
  }

  // Fermer la modal de succès
  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.currentOrderId = null;
  }

  // Retourne l'URL complète d'une image ou une image par défaut
  getImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'assets/riz.png'; // Image par défaut
    }
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    // Assure que l'URL ne commence pas par '/' pour éviter '//' dans l'URL finale
    return `${environment.apiUrl}/${imagePath.replace(/^\/+/, '')}`;
  }

  // Récupère l'image de la première item de la commande ou une image par défaut
  getOrderImage(order: Order): string {
    if (order.items && order.items.length > 0 && order.items[0].image) {
      return this.getImageUrl(order.items[0].image);
    }
    return 'assets/riz.png'; // fallback
  }

  selectedOrder: Order | null = null;

  // Ouvrir la popup détails
  openOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  // Fermer la popup
  closeOrderDetails(): void {
    this.selectedOrder = null;
  }
}
