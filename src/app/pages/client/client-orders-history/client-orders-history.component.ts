// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { PartenaireService, Order } from '../../../services/partenaire.service';

// @Component({
//   selector: 'app-client-orders-history',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './client-orders-history.component.html',
//   styleUrl: './client-orders-history.component.css'
// })
// export class ClientOrdersHistoryComponent implements OnInit {
//   orders: Order[] = [];
//   selectedOrder: Order | null = null;

//   constructor(private partenaireService: PartenaireService) {}

//   ngOnInit(): void {
//     this.loadOrders();
//   }

//   loadOrders(): void {
//     this.partenaireService.getMyOrders().subscribe({
//       next: (orders: Order[]) => {
//         this.orders = orders;
//       },
//       error: (err: any) => {
//         console.error('Erreur chargement commandes:', err);
//       }
//     });
//   }

//   openOrderDetails(order: Order): void {
//     this.selectedOrder = order;
//   }

//   closeOrderDetails(): void {
//     this.selectedOrder = null;
//   }

//   getOrderImage(order: Order): string {
//     if (order.items && order.items.length > 0 && order.items[0].image) {
//       return this.getImageUrl(order.items[0].image);
//     }
//     return 'assets/riz.png';
//   }

//   getImageUrl(imagePath?: string): string {
//     if (!imagePath) return 'assets/riz.png';
//     if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
//     return `https://yakalma.onrender.com/${imagePath.replace(/^\/+/, '')}`;
//   }
// }

// =====================
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { PartenaireService, Order } from '../../../services/partenaire.service';
import { HeaderClientComponent } from "../header-client/header-client.component";
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-orders-history',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderClientComponent],
  templateUrl: './client-orders-history.component.html',
  styleUrl: './client-orders-history.component.css'
})
export class ClientOrdersHistoryComponent implements OnInit {
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
    this.loadDelivererLocation(order);
  }

  // Fermer la popup
  closeOrderDetails(): void {
    this.selectedOrder = null;
  }



  // Charge la localisation du livreur pour une commande
  loadDelivererLocation(order: Order): void {
    if (order.courierId && order.status === 'en_cours') {
      this.partenaireService.getLivreurLocation(order.courierId).subscribe({
        next: (response) => {
          // TODO: Intégrer avec Google Maps pour afficher la localisation
          console.log('Localisation livreur:', response.location);
        },
        error: (err) => {
          console.error('Erreur récupération localisation livreur:', err);
        }
      });
    }
  }
}

