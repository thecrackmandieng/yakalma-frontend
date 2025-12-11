import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface Table {
  _id: string;
  name: string;
  qrCode: string;
  restaurantId: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Génère les headers d'authentification avec le token JWT
   */
  private getAuthHeaders(): HttpHeaders {
    if (!isPlatformBrowser(this.platformId)) {
      return new HttpHeaders();
    }
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  /**
   * Créer une nouvelle table
   */
  createTable(name: string, restaurantId: string): Observable<{ message: string; table: Table }> {
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY;
    }
    const headers = this.getAuthHeaders();
    return this.http.post<{ message: string; table: Table }>(
      `${this.baseUrl}/restaurants/tables`,
      { name, restaurantId },
      { headers }
    );
  }

  /**
   * Récupérer toutes les tables du restaurant
   */
  getTables(): Observable<Table[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY;
    }
    const headers = this.getAuthHeaders();
    return this.http.get<Table[]>(
      `${this.baseUrl}/restaurants/tables`,
      { headers }
    );
  }

  /**
   * Supprimer une table
   */
  deleteTable(tableId: string): Observable<{ message: string }> {
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY;
    }
    const headers = this.getAuthHeaders();
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/restaurants/tables/${tableId}`,
      { headers }
    );
  }
}
