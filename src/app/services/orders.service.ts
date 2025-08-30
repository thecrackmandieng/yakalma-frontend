import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { tap, catchError } from 'rxjs/operators';

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  deliveredAt?: string;
  items?: any[];
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl = 'https://yakalma.onrender.com/api';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /** SSR-safe auth headers */
  private getAuthHeaders(): { headers: HttpHeaders } {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('⚠️ [OrdersService] SSR - pas de headers auth');
      return { headers: new HttpHeaders() };
    }

    // Use the same key as auth interceptor
    const tokenKeys = ['token', 'authToken', 'accessToken', 'jwt'];
    let token = null;

    for (const key of tokenKeys) {
      token = localStorage.getItem(key);
      if (token) break;
    }

    if (!token) {
      console.warn('⚠️ [OrdersService] Aucun token trouvé dans localStorage');
      // Don't log localStorage keys during SSR to avoid errors
    }

    const headersConfig = {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    };

    console.log('🔑 [OrdersService] Headers configurés:', {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 10)}...` : 'null'
    });

    return { headers: new HttpHeaders(headersConfig) };
  }

  /**
   * Récupérer toutes les commandes livrées
   */
  getDeliveredOrders(): Observable<OrdersResponse> {
    console.log('🚀 [OrdersService] Début récupération commandes livrées...');
    
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('⚠️ [OrdersService] SSR détecté - retour vide');
      return new Observable(observer => {
        observer.next({ orders: [], total: 0 });
        observer.complete();
      });
    }

    const authHeaders = this.getAuthHeaders();
    console.log('📋 [OrdersService] Headers envoyés:', {
      hasAuth: !!authHeaders.headers.get('Authorization'),
      authHeader: authHeaders.headers.get('Authorization')?.substring(0, 20) + '...'
    });

    return this.http.get<OrdersResponse>(`${this.baseUrl}/orders/delivered`, authHeaders).pipe(
      tap({
        next: (response) => {
          console.log('✅ [OrdersService] Commandes livrées reçues:', {
            count: response.orders.length,
            total: response.total
          });
        },
        error: (error) => {
          console.error('❌ [OrdersService] Erreur récupération commandes livrées:', {
            status: error.status,
            message: error.message,
            url: `${this.baseUrl}/orders/delivered`
          });
        }
      })
    );
  }

  /**
   * Récupérer une commande spécifique
   */
  getOrderById(orderId: number): Observable<Order> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable(observer => {
        observer.next({} as Order);
        observer.complete();
      });
    }

    return this.http.get<Order>(`${this.baseUrl}/orders/${orderId}`, this.getAuthHeaders());
  }

  /**
   * Marquer une commande comme livrée
   */
  markOrderAsDelivered(orderId: number): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable(observer => {
        observer.next({ success: true });
        observer.complete();
      });
    }

    return this.http.put(`${this.baseUrl}/orders/${orderId}/deliver`, {}, this.getAuthHeaders());
  }
}
