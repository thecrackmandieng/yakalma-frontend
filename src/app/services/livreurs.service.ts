import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { Livreur } from '../pages/models/livreur.model';

@Injectable({
  providedIn: 'root'
})
export class LivreursService {
  private baseUrl = 'https://yakalma.onrender.com/api/livreurs';

  constructor(private http: HttpClient) {}

  /** Récupère le token JWT depuis localStorage */
  private getAuthHeaders(isFormData: boolean = false): { headers: HttpHeaders } {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }

    const headersConfig = {
      'Authorization': `Bearer ${token}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    };

    const headers = new HttpHeaders(headersConfig);
    return { headers };
  }

  /** Récupère tous les livreurs */
  getLivreurs(): Observable<Livreur[]> {
    return this.http
      .get<{ livreurs: Livreur[] }>(`${this.baseUrl}/all`, this.getAuthHeaders())
      .pipe(map(response => response.livreurs));
  }

  /** Étape 1 : pré-inscription avec email uniquement */
  preRegisterLivreur(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/pre-register`, { email }, this.getAuthHeaders());
  }

  /** Étape 2 : inscription complète avec FormData pour fichiers */
  registerLivreur(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, formData, this.getAuthHeaders(true));
  }

  /** Met à jour un livreur par ID (informations générales) */
updateLivreur(id: string | number, data: Partial<Livreur> | FormData): Observable<any> {
  const isFormData = data instanceof FormData;
  return this.http.put(`${this.baseUrl}/${id}`, data, this.getAuthHeaders(isFormData));
}


  /** Met à jour uniquement le statut d’un livreur */
  updateLivreurStatus(livreurId: string, status: string): Observable<any> {
    const body = { livreurId, status };
    return this.http.put(`${this.baseUrl}/status`, body, this.getAuthHeaders());
  }
updateLivreurWithFiles(id: string, formData: FormData): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}`, formData, this.getAuthHeaders(true));
}

  /** Supprime un livreur par son ID */
  deleteLivreur(id: string | number): Observable<any> {
    if (!id) return throwError(() => new Error('ID invalide'));
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}

