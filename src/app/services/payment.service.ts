import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
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

  initPayment(data: any) {
    // Assurer que customerName n'est jamais vide
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

    console.log('Payload PayTech:', payload);
    console.log('API URL:', this.apiUrl);
    console.log('API Key:', this.apiKey ? 'Présente' : 'Manquante');
    console.log('API Secret:', this.apiSecret ? 'Présente' : 'Manquante');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'API_KEY': this.apiKey,
      'API_SECRET': this.apiSecret
    });

    return this.http.post<any>(this.apiUrl, payload, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur détaillée PayTech:', error);

        let errorMessage = 'Erreur lors de la requête de paiement';

        if (error.status === 401) {
          errorMessage = 'Erreur d\'authentification PayTech. Vérifiez vos clés API et l\'identifiant du vendeur.';
        } else if (error.status === 400) {
          errorMessage = 'Requête PayTech invalide. Vérifiez les données envoyées.';
        } else if (error.status === 0) {
          errorMessage = 'Impossible de se connecter à PayTech. Vérifiez votre connexion internet.';
        } else if (error.error && error.error.message) {
          errorMessage = `Erreur PayTech: ${error.error.message}`;
        }

        console.error('Message d\'erreur:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
