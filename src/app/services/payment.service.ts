import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = 'https://yakalma.onrender.com/api/payments';

  constructor(private http: HttpClient) {}

  initPayment(data: any) {
    return this.http.post<any>(`${this.apiUrl}/init`, data);
  }
}
