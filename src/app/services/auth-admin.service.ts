import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {
  private baseUrl = 'https://yakalma.onrender.com/api/admins';

  constructor(private http: HttpClient) {}

  login(emailOrPhone: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { emailOrPhone, password });
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }

  isLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private getAuthHeaders() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  getProfile(): Observable<{ admin: any }> {
    return this.http.get<{ admin: any }>(`${this.baseUrl}/profile`, this.getAuthHeaders());
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/change-password`, { currentPassword, newPassword }, this.getAuthHeaders());
  }
updateProfile(profileData: { firstName: string; lastName: string; email: string; phone: string }): Observable<any> {
  // On doit envoyer par ex. "name" sous forme concaténée dans backend
  const { firstName, lastName, email, phone } = profileData;
  const name = `${firstName} ${lastName}`;

  return this.http.put(`${this.baseUrl}/profile`, { name, email, phone }, this.getAuthHeaders());
}


  // Autres méthodes du service selon besoin
}
