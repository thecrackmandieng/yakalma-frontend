import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { faUsers, faHandshake, faTruck, faDollarSign, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, BaseChartDirective, FontAwesomeModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  // Icônes FontAwesome
  faUsers = faUsers;
  faHandshake = faHandshake;
  faTruck = faTruck;
  faDollarSign = faDollarSign;
  faMoneyBill = faMoneyBill;

  // Cartes statistiques
  cards = [
    { icon: this.faUsers, title: 'Total Clients', value: 150 },
    { icon: this.faHandshake, title: 'Total Partenaires', value: 45 },
    { icon: this.faTruck, title: 'Total Livreurs', value: 18 },
    { icon: this.faDollarSign, title: 'Total Payé Partenaires', value: '1 200 000 XOF' },
    { icon: this.faMoneyBill, title: 'Total Payé Livreurs', value: '800 000 XOF' },
  ];

  // Liste des administrateurs
  admins = [
    { name: 'Moustapha Dieng', email: 'moustapha@example.com', role: 'Super Admin', isActive: true },
    { name: 'Fatou Ndiaye', email: 'fatou@example.com', role: 'Admin', isActive: true },
    { name: 'Alioune Ba', email: 'alioune@example.com', role: 'Admin', isActive: false },
    { name: 'Seynabou Diallo', email: 'seynabou@example.com', role: 'Admin', isActive: true },
    { name: 'Cheikh Ndiaye', email: 'cheikh@example.com', role: 'Admin', isActive: true }
  ];

  // Pagination
  itemsPerPage = 3;
  currentPage = 1;

  paginatedAdmins() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.admins.slice(start, start + this.itemsPerPage);
  }

  totalPages() {
    return Math.ceil(this.admins.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Graphique historique des commandes
  public lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
    datasets: [
      {
        data: [15, 30, 45, 20, 60],
        label: 'Commandes',
        fill: true,
        borderColor: '#5371FF',
        backgroundColor: 'rgba(83,113,255,0.2)',
        tension: 0.4,
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = { responsive: true };
  public lineChartType: 'line' = 'line';

  // Graphique Encaissements
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
    datasets: [
      { data: [500000, 700000, 600000, 900000, 1000000], label: 'Restaurants', backgroundColor: '#5371FF' },
      { data: [300000, 400000, 350000, 450000, 500000], label: 'Livreurs', backgroundColor: '#FF5733' }
    ]
  };
  public barChartOptions: ChartOptions<'bar'> = { responsive: true };
  public barChartType: 'bar' = 'bar';

  // Graphique Doughnut
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Clients', 'Partenaires', 'Livreurs'],
    datasets: [
      { data: [150, 45, 18], backgroundColor: ['#5371FF', '#FFB84D', '#FF5733'] }
    ]
  };
  public doughnutChartOptions: ChartOptions<'doughnut'> = { responsive: true };
  public doughnutChartType: 'doughnut' = 'doughnut';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private library: FaIconLibrary) {
    library.addIcons(faUsers, faHandshake, faTruck, faDollarSign, faMoneyBill);
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  editAdmin(admin: any) {
    console.log('Modifier', admin);
  }

  deleteAdmin(admin: any) {
    console.log('Supprimer', admin);
  }
}
