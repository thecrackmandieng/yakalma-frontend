import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface OrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  supplements: any[];
  image?: string;
}

export interface Order {
  id: string; // MongoDB _id → string
  orderNumber?: string;
  customerName: string;
  address: string;
  contact: string;
  items: OrderItem[];
  total: number;

  status: 'en_attente' | 'en_cours' | 'livre';
  createdAt?: string;
  deliveredAt?: string;

  restaurantId: string;
  restaurantName?: string;
  restaurantAddress?: string;
  restaurantPhone?: string;

  courierId?: string;
  paymentInfo?: {
    card?: string;
    exp?: string;
    cvc?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private baseUrl = `${environment.apiUrl}/api/orders`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /** 🔑 Ajouter les headers avec token */
  private getAuthHeaders(): { headers: HttpHeaders } {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }

    const headersConfig: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return { headers: new HttpHeaders(headersConfig) };
  }

  /** 📦 Récupérer toutes mes commandes */
  getMyOrders(status?: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/my`, this.getAuthHeaders());
  }

  /** 📦 Récupérer les commandes livrées */
  getDeliveredOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/delivered`, this.getAuthHeaders());
  }

  /** 🔍 Récupérer une commande spécifique */
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`, this.getAuthHeaders());
  }

  /** ✅ Marquer une commande comme livrée */
  markOrderAsDelivered(orderId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${orderId}/deliver`, {}, this.getAuthHeaders());
  }

  /** 🚚 Assigner une commande au livreur */
  assignOrderToCourier(orderId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${orderId}/assign`, {}, this.getAuthHeaders());
  }
}
