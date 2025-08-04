import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Livreur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminLivreurService {

  private apiUrl = 'http://localhost:3000/api/livreurs'; // à adapter selon ton backend

  constructor(private http: HttpClient) {}

  // 🔁 Liste des livreurs
  getAllLivreurs(): Observable<Livreur[]> {
    return this.http.get<Livreur[]>(this.apiUrl);
  }

  // ➕ Ajouter un livreur
  addLivreur(livreur: Livreur): Observable<Livreur> {
    return this.http.post<Livreur>(this.apiUrl, livreur);
  }

  // ✏️ Modifier un livreur
  updateLivreur(livreur: Livreur): Observable<Livreur> {
    return this.http.put<Livreur>(`${this.apiUrl}/${livreur.id}`, livreur);
  }

  // ❌ Supprimer un livreur
  deleteLivreur(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ✅ Approuver un livreur
  approveLivreur(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }

  // 🚫 Rejeter un livreur
  rejectLivreur(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {});
  }
}
