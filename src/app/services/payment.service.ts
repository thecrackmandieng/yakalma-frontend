import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {

  private apiUrl = environment.paytechApiUrl; // URL de PayTech

  constructor(private http: HttpClient) {}

  initPayment(data: any) {
    // Préparer le payload attendu par PayTech
    const payload = {
      item_name: data.item_name,
      item_price: data.item_price,
      currency: data.currency || 'XOF',
      ref_command: data.ref_command || `CMD${Date.now()}`,
      env: 'test',
      success_url: environment.returnUrl,
      cancel_url: environment.returnUrl,
      ipn_url: environment.notifyUrl
    };

    // Appel POST direct vers PayTech
    return this.http.post<any>(this.apiUrl, payload);
  }
}
