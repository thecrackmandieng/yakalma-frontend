import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; // ajuste le chemin si nécessaire

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private paytechApiUrl = environment.paytechApiUrl;
  private returnUrl = environment.returnUrl;
  private notifyUrl = environment.notifyUrl;

  constructor(private http: HttpClient) {}

  initPayment(data: any) {
    const payload = {
      item_name: data.item_name,
      item_price: data.item_price,
      currency: data.currency || 'XOF',
      ref_command: data.ref_command || `CMD${Date.now()}`,
      env: 'test',
      customerName: data.customerName || '',
      customerEmail: data.customerEmail || '',
      success_url: this.returnUrl,
      cancel_url: this.returnUrl,
      ipn_url: this.notifyUrl
    };

    return this.http.post<any>(this.paytechApiUrl, payload);
  }
}
