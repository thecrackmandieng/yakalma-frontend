import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'API-KEY': this.apiKey,
      'API-SECRET': this.apiSecret
    });

    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
}
