import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = environment.paytechApiUrl;
  private apiKey = environment.API_KEY;
  private apiSecret = environment.API_SECRET;
  private successUrl = environment.returnUrl;
  private cancelUrl = environment.returnUrl;
  private ipnUrl = environment.notifyUrl;

  constructor(private http: HttpClient) {}

  /** 🔹 Initialiser un paiement */
  initPayment(data: {
    item_name: string;
    item_price: number;
    currency?: string;
    ref_command?: string;
    customerName: string;
    customerEmail: string;
  }): Observable<{ redirect_url?: string }> {
    if (!data.customerName) data.customerName = 'Client';

    const payload = {
      item_name: data.item_name,
      item_price: data.item_price,
      currency: data.currency || 'XOF',
      ref_command: data.ref_command || `CMD${Date.now()}`,
      env: 'test',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      success_url: this.successUrl,
      cancel_url: this.cancelUrl,
      ipn_url: this.ipnUrl
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'API_KEY': this.apiKey,
      'API_SECRET': this.apiSecret
    });

    return this.http.post<{ redirect_url?: string }>(this.apiUrl, payload, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erreur lors de la requête de paiement';

        if (error.status === 401) {
          errorMessage = 'Erreur d’authentification PayTech. Vérifiez vos clés API et l’identifiant du vendeur.';
        } else if (error.status === 400) {
          errorMessage = 'Requête PayTech invalide. Vérifiez les données envoyées.';
        } else if (error.status === 0) {
          errorMessage = 'Impossible de se connecter à PayTech. Vérifiez votre connexion internet.';
        } else if (error.error && error.error.message) {
          errorMessage = `Erreur PayTech: ${error.error.message}`;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /** 🔹 Vérifier l’état d’un paiement */
  verifyPayment(ref: string): Observable<{ status: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'API_KEY': this.apiKey,
      'API_SECRET': this.apiSecret
    });

    // ⚠️ Vérifie bien l’endpoint exact de ton API PayTech (ici c’est un exemple)
    return this.http.get<{ status: string }>(`${this.apiUrl}/verify/${ref}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erreur lors de la vérification du paiement';
        if (error.error && error.error.message) {
          errorMessage = `Erreur PayTech: ${error.error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
