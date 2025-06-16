import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartConfiguration, ChartData, ChartOptions, ChartType, ChartTypeRegistry } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { faUsers, faHandshake, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, NgChartsModule, FontAwesomeModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  // Icons
  faUsers = faUsers;
  faHandshake = faHandshake;
  faTruck = faTruck;

  // Données pour les cartes
  totalClients = 150;
  totalPartenaires = 45;
  totalLivreurs = 18;

  // Données du graphique
  public lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
    datasets: [
      {
        data: [15, 30, 45, 20, 60],
        label: 'Commandes',
        fill: true,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66,165,245,0.2)',
        tension: 0.4,
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      }
    }
  };

  public lineChartType: keyof ChartTypeRegistry = 'line';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private library: FaIconLibrary) {
    library.addIcons(faUsers, faHandshake, faTruck);
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
