import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Livreur } from '../pages/models/livreur.model';

@Injectable({
  providedIn: 'root'
})
export class LivreursService {
  private baseUrl = 'https://yakalma.onrender.com/api/livreurs';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /** SSR-safe auth headers */
  private getAuthHeaders(isFormData: boolean = false): { headers: HttpHeaders } {
    // Skip auth headers during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return { headers: new HttpHeaders() };
    }

    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    if (token) {
      const headersConfig = {
        'Authorization': `Bearer ${token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      };
      return { headers: new HttpHeaders(headersConfig) };
    }

    return { headers: new HttpHeaders() };
  }

  /** SSR-safe method to get livreurs */
  getLivreurs(): Observable<Livreur[]> {
    // Return empty array during SSR to avoid API calls
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    return this.http
      .get<{ livreurs: Livreur[] }>(`${this.baseUrl}/all`, this.getAuthHeaders())
      .pipe(map(response => response.livreurs));
  }

  /** SSR-safe pre-registration */
  preRegisterLivreur(email: string): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable(observer => {
        observer.next({ success: true, message: 'SSR mode - skipped' });
        observer.complete();
      });
    }

    return this.http.post(`${this.baseUrl}/pre-register`, { email }, this.getAuthHeaders());
  }

  /** SSR-safe registration */
  registerLivreur(formData: FormData): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable(observer => {
        observer.next({ success: true, message: 'SSR mode - skipped' });
        observer.complete();
      });
    }

    return this.http.post(`${this.baseUrl}/register`, formData, this.getAuthHeaders(true));
  }

  /** SSR-safe update */
  updateLivreur(id: string | number, data: Partial<Livreur> | FormData): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable(observer => {
        observer.next({ success: true, message: 'SSR mode - skipped' });
        observer.complete();
      });
    }

    const isFormData = data instanceof FormData;
    return this.http.put(`${this.baseUrl}/${id}`, data, this.getAuthHeaders(isFormData));
  }

  /** SSR-safe status update */
  updateLivreurStatus(livreurId: string, status: string): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable(observer => {
        observer.next({ success: true, message: 'SSR mode - skipped' });
        observer.complete();
      });
    }

    const body = { livreurId, status };
    return this.http.put(`${this.baseUrl}/status`, body, this.getAuthHeaders());
  }

  /** SSR-safe file update */
  updateLivreurWithFiles(id: string, formData: FormData): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable(observer => {
        observer.next({ success: true, message: 'SSR mode - skipped' });
        observer.complete();
      });
    }

    return this.http.put(`${this.baseUrl}/${id}`, formData, this.getAuthHeaders(true));
  }

  /** SSR-safe delete */
  deleteLivreur(id: string | number): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable(observer => {
        observer.next({ success: true, message: 'SSR mode - skipped' });
        observer.complete();
      });
    }

    if (!id) return throwError(() => new Error('ID invalide'));
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}

