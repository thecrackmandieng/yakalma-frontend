import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// 🔹 Interfaces
export interface Livreur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  status: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRestaurants: number;
  totalCouriers: number;
  totalClients: number;
  totalAdmins: number;
  totalPayments?: number; // <- ajouté pour le montant total payé
}

export interface Admin {
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface OrdersHistory {
  _id: string; // format YYYY-MM
  count: number;
}

export interface UserDistribution {
  role: string;
  count: number;
}

export interface DashboardData {
  stats: DashboardStats;
  admins: Admin[];
  ordersHistory: OrdersHistory[];
  userDistribution: UserDistribution[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminLivreurService {

  private apiUrl = `${environment.apiUrl}/api/livreurs`;
  private dashboardUrl = `${environment.apiUrl}/api/admins/dashboard-data`;

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

  // 📊 Récupérer les données du dashboard admin
  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.dashboardUrl);
  }
}
