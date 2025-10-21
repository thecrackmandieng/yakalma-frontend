import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  transactionId: string = '';
  amount: number = 0;
  itemName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupérer les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      this.transactionId = params['transaction_id'] || 'N/A';
      this.amount = params['amount'] ? parseInt(params['amount']) : 0;
      this.itemName = params['item_name'] || 'Commande';
    });
  }

  goToDashboard() {
    this.router.navigate(['/client/dashboard']);
  }

  goToOrders() {
    this.router.navigate(['/client/orders-history']);
  }
}
