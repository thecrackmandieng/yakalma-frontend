// src/app/services/partenaire.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Partenaire } from '../pages/models/partenaire.model';
import { MenuItem } from '../pages/models/menu-item.model';

export interface OrderItem {
  name: string;
  quantity: number;
  image?: string;
}

export interface Order {
  _id?: string;
  items: OrderItem[];
  customerName: string;
  address: string;
  contact: string;
  restaurantId: string;

  restaurantName?: string;
  restaurantPhone?: string;
  restaurantAddress?: string;

  courierId?: string;
  status?: 'en_attente' | 'en_cours' | 'livre';
  createdAt?: string;

  paymentInfo?: {
    card?: string;
    exp?: string;
    cvc?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class PartenaireService {
  private baseUrl = 'https://yakalma.onrender.com/api/restaurants';
  private ordersUrl = 'https://yakalma.onrender.com/api/orders';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /** 🔐 Ajoute les headers avec JWT */
  private getAuthHeaders(isFormData = false): { headers: HttpHeaders } {
    let token = '';

    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }

    const headersConfig: Record<string, string> = {
      Authorization: `Bearer ${token}`
    };

    if (!isFormData) headersConfig['Content-Type'] = 'application/json';

    return { headers: new HttpHeaders(headersConfig) };
  }

  /** 🔍 Vérifie si l'utilisateur est authentifié */
  public isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const token = localStorage.getItem('token');
    return !!(token && token !== 'undefined' && token !== 'null' && token.trim() !== '');
  }

  // -------------------- PARTENAIRES --------------------

  getPartenaires(): Observable<Partenaire[]> {
    return this.http
      .get<{ restaurants: Partenaire[] }>(`${this.baseUrl}/all`, this.getAuthHeaders())
      .pipe(map(r => r.restaurants));
  }


  preRegisterPartenaire(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/pre-register`, { email }, this.getAuthHeaders());
  }

  registerPartenaire(formData: FormData): Observable<Partenaire> {
    return this.http.post<Partenaire>(`${this.baseUrl}/register`, formData, this.getAuthHeaders(true));
  }

  updatePartenaire(id: string, formData: FormData): Observable<Partenaire> {
    return this.http.put<Partenaire>(`${this.baseUrl}/update/${id}`, formData, this.getAuthHeaders(true));
  }

  deletePartenaire(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }

  updatePartenaireStatus(id: string, status: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/status`, { restaurantId: id, status }, this.getAuthHeaders());
  }

  toggleBlockPartenaire(id: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/block/${id}`, {}, this.getAuthHeaders());
  }

  getRestaurantProfile(): Observable<{ restaurant: Partenaire }> {
    return this.http.get<{ restaurant: Partenaire }>(`${this.baseUrl}/profile`, this.getAuthHeaders());
  }

  getPartenaireById(id: string): Observable<Partenaire> {
    return this.http.get<Partenaire>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }

  // -------------------- MENU --------------------

  /** 🔓 Public : Menu d'un restaurant par ID */
  getMenuByRestaurantId(restaurantId: string): Observable<MenuItem[]> {
    return this.http
      .get<{ menu: MenuItem[] }>(`${this.baseUrl}/menu/restaurant/${restaurantId}`)
      .pipe(map(r => r.menu));
  }

  /** 🔒 Menu du restaurant connecté */
  getRestaurantMenu(): Observable<MenuItem[]> {
    return this.http
      .get<{ menu: MenuItem[] }>(`${this.baseUrl}/menu`, this.getAuthHeaders())
      .pipe(map(r => r.menu));
  }

  addMenuItem(formData: FormData): Observable<{ menuItem: MenuItem }> {
    return this.http.post<{ menuItem: MenuItem }>(`${this.baseUrl}/menu`, formData, this.getAuthHeaders(true));
  }

  deleteMenuItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/menu/${id}`, this.getAuthHeaders());
  }

  updateMenuItem(id: string, formData: FormData): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.baseUrl}/menu/${id}`, formData, this.getAuthHeaders(true));
  }

  // -------------------- COMMANDES --------------------

  createOrder(payload: Order): Observable<{ order: Order }> {
    return this.http.post<{ order: Order }>(this.ordersUrl, payload, this.getAuthHeaders());
  }

  getMyOrders(status?: string): Observable<Order[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);

    return this.http.get<Order[]>(`${this.ordersUrl}/my`, { ...this.getAuthHeaders(), params }).pipe(
      map((orders) => {
        return orders;
      })
    );
  }

  getDeliveredOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.ordersUrl}/delivered`, this.getAuthHeaders());
  }

  private updateOrderStatus(orderId: string, status: 'en_attente' | 'en_cours' | 'livre'): Observable<Order> {
    const headers = this.getAuthHeaders().headers.set('Content-Type', 'application/json');
    return this.http.patch<Order>(`${this.ordersUrl}/${orderId}/status`, { status }, { headers });
  }

  acceptOrderRestaurant(orderId: string): Observable<Order> {
    return this.updateOrderStatus(orderId, 'en_cours');
  }

  deliverOrderRestaurant(orderId: string): Observable<Order> {
    return this.updateOrderStatus(orderId, 'livre');
  }

  /** alias rétrocompatible */
  acceptOrder(orderId: string) { return this.acceptOrderRestaurant(orderId); }
  deliverOrder(orderId: string) { return this.deliverOrderRestaurant(orderId); }

  assignOrderToCourier(orderId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.ordersUrl}/${orderId}/assign`, {}, this.getAuthHeaders());
  }
}
