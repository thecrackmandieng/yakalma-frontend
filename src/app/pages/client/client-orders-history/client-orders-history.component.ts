import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartenaireService, Order } from '../../../services/partenaire.service';

@Component({
  selector: 'app-client-orders-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-orders-history.component.html',
  styleUrl: './client-orders-history.component.css'
})
export class ClientOrdersHistoryComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;

  constructor(private partenaireService: PartenaireService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.partenaireService.getMyOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
      },
      error: (err: any) => {
        console.error('Erreur chargement commandes:', err);
      }
    });
  }

  openOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  getOrderImage(order: Order): string {
    if (order.items && order.items.length > 0 && order.items[0].image) {
      return this.getImageUrl(order.items[0].image);
    }
    return 'assets/riz.png';
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) return 'assets/riz.png';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    return `https://yakalma.onrender.com/${imagePath.replace(/^\/+/, '')}`;
  }
}
