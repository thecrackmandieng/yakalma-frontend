import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { TokenService } from './token.service';

interface Profile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  image?: string;
  documents?: string[];
}

interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

interface ProfileResponse {
  livreur?: Profile;
  restaurant?: Profile;
  user?: Profile;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://yakalma.onrender.com/api';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  private getAuthHeaders(): HttpHeaders {
    if (!isPlatformBrowser(this.platformId)) {
      return new HttpHeaders();
    }
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  /**
   * Connexion utilisateur (email ou téléphone)
   */
  login(emailOrPhone: string, password: string): Observable<{ token: string; user: any }> {
    return this.http.post<{ token: string; user: any }>(
      `${this.baseUrl}/auth/login`,
      { emailOrPhone, password }
    );
  }

  /**
   * Pré-inscription livreur (email uniquement)
   */
  preRegisterLivreur(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/livreurs/pre-register`, { email });
  }

  /**
   * Enregistrement complet d’un livreur avec fichiers (FormData)
   */
  registerLivreur(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/livreurs/register`, formData);
  }

  /**
   * Pré-inscription partenaire/restaurant
   */
  preRegisterPartenaire(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/restaurants/pre-register`, { email });
  }

  /**
   * Enregistrement complet partenaire/restaurant
   */
  registerPartenaire(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/restaurants/register`, formData);
  }

  /**
   * ✅ Récupération générique du profil utilisateur (livreur, restaurant ou user)
   */
  getRestaurantProfile(): Observable<{ restaurant: Profile }> {
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY; // empêche les erreurs côté serveur
    }
    const headers = this.getAuthHeaders();
    return this.http.get<{ restaurant: Profile }>(`${this.baseUrl}/restaurants/profile`, { headers });
  }
  /**
   * 🔁 Récupération spécifique du profil livreur
   */
  getLivreurProfile(): Observable<{ livreur: Profile }> {
    if (!isPlatformBrowser(this.platformId)) return EMPTY;
    return this.http.get<{ livreur: Profile }>(`${this.baseUrl}/livreurs/profile`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * 🔁 Mise à jour du profil livreur
   */
updateLivreurProfile(id: string, data: Partial<Profile> | FormData): Observable<any> {
  return this.http.put(`${this.baseUrl}/livreurs/${id}`, data, {
    headers: this.getAuthHeaders(),
  });
}



  /**
   * 🔁 Mise à jour du profil partenaire/restaurant
   */
  updateProfile(data: Partial<Profile> | FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/restaurants/profile`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * 🔐 Changement mot de passe livreur
   */
  changeLivreurPassword(payload: PasswordChangePayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/livreurs/password/change`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * 🔐 Changement mot de passe partenaire/restaurant
   */
  changePassword(payload: PasswordChangePayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/restaurants/password/change`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Déconnexion : suppression du token et infos utilisateur
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('token');
  }

  /**
   * Récupère le token JWT
   */
  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
  }

  /**
   * Récupère l'utilisateur courant stocké en local
   */
  getCurrentUser(): any {
    if (!isPlatformBrowser(this.platformId)) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
