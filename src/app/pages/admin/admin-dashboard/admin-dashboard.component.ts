import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { faUsers, faHandshake, faTruck, faDollarSign, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminLivreurService, DashboardData } from '../../../services/admin-livreur.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, NgChartsModule, FontAwesomeModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  // Icônes FontAwesome
  faUsers = faUsers;
  faHandshake = faHandshake;
  faTruck = faTruck;
  faDollarSign = faDollarSign;
  faMoneyBill = faMoneyBill;

  // Cartes statistiques dynamiques
  cards: any[] = [];

  // Liste des administrateurs dynamique
  admins: any[] = [];

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

  // Graphiques dynamiques
  public lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#374151', font: { size: 12 } }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => ` ${context.raw} commandes`
        }
      }
    },
    scales: {
      x: { ticks: { color: '#6B7280' }, grid: { color: '#E5E7EB' } },
      y: { beginAtZero: true, ticks: { stepSize: 1, color: '#6B7280' }, grid: { color: '#E5E7EB' } }
    }
  };
  public lineChartType: 'line' = 'line';

  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public barChartOptions: ChartOptions<'bar'> = { responsive: true };
  public barChartType: 'bar' = 'bar';

  public doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  public doughnutChartOptions: ChartOptions<'doughnut'> = { responsive: true };
  public doughnutChartType: 'doughnut' = 'doughnut';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private library: FaIconLibrary,
    private adminLivreurService: AdminLivreurService
  ) {
    library.addIcons(faUsers, faHandshake, faTruck, faDollarSign, faMoneyBill);
  }

  ngOnInit(): void {
    this.adminLivreurService.getDashboardData().subscribe((data: DashboardData) => {
      // Cartes statistiques
      this.cards = [
        { icon: this.faUsers, title: 'Total Clients', value: data.stats.totalClients },
        { icon: this.faHandshake, title: 'Total Partenaires', value: data.stats.totalRestaurants },
        { icon: this.faTruck, title: 'Total Livreurs', value: data.stats.totalCouriers },
        { icon: this.faDollarSign, title: 'Total Admins', value: data.stats.totalAdmins },
          { icon: this.faMoneyBill, title: 'Montant Total Payé', value: data.stats.totalPayments + ' CFA' } // <-- Nouvelle carte

      ];

      // Liste des admins
      this.admins = data.admins;

      // Graphique historique des commandes (semaine courante, Lundi → Dimanche)
      this.filterByWeek();

      // Graphique doughnut (répartition utilisateurs)
      this.doughnutChartData = {
        labels: data.userDistribution.map(u => u.role.charAt(0).toUpperCase() + u.role.slice(1)),
        datasets: [{ data: data.userDistribution.map(u => u.count), backgroundColor: ['#5371FF', '#FFB84D', '#FF5733'] }]
      };

      // Graphique bar (commandes)
      this.barChartData = {
        labels: data.ordersHistory.map(h => h._id),
        datasets: [{ data: data.ordersHistory.map(h => h.count), label: 'Commandes', backgroundColor: '#5371FF' }]
      };
    });
  }

  /**
   * Met à jour le graphique des commandes (Lundi → Dimanche)
   */
  private updateLineChart(history: any[], labels?: string[]) {
    this.lineChartData = {
      labels: labels || history.map(h => h._id),
      datasets: [
        {
          data: history.map(h => h.count),
          label: 'Commandes',
          fill: true,
          borderColor: '#5371FF',
          backgroundColor: 'rgba(83,113,255,0.2)',
          pointBackgroundColor: '#5371FF',
          pointBorderColor: '#ffffff',
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4
        }
      ]
    };
  }

  /**
   * Filtrage par semaine (toujours Lundi → Dimanche)
   */
  // Filtrage par semaine (toujours Lundi → Dimanche)
filterByWeek() {
  const currentDate = new Date();
  const day = currentDate.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // ajuste pour lundi
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() + diff);

  const weekDates: Date[] = [];
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    weekDates.push(d);
  }

  this.adminLivreurService.getDashboardData().subscribe((data: DashboardData) => {
    const countsByDay = new Array(7).fill(0);

    data.ordersHistory.forEach(order => {
      const orderDate = new Date(order._id); // <-- utilise _id pour la date
      weekDates.forEach((d, idx) => {
        if (
          orderDate.getFullYear() === d.getFullYear() &&
          orderDate.getMonth() === d.getMonth() &&
          orderDate.getDate() === d.getDate()
        ) {
          countsByDay[idx] += 1; // incrémente le nombre de commandes
        }
      });
    });

    this.updateLineChart(
      countsByDay.map((count, idx) => ({ _id: daysOfWeek[idx], count })),
      daysOfWeek
    );
  });
}


  filterByMonth() {
    const currentDate = new Date();
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    this.adminLivreurService.getDashboardData().subscribe((data: DashboardData) => {
      const filteredData = data.ordersHistory.filter(order => {
      const orderDate = new Date(order._id); // <-- utilise _id pour la date
        return orderDate >= monthStart && orderDate <= monthEnd;
      });
      this.updateLineChart(filteredData);
    });
  }

  filterByYear() {
    const currentDate = new Date();
    const yearStart = new Date(currentDate.getFullYear(), 0, 1);
    const yearEnd = new Date(currentDate.getFullYear(), 11, 31);

    this.adminLivreurService.getDashboardData().subscribe((data: DashboardData) => {
      const filteredData = data.ordersHistory.filter(order => {
      const orderDate = new Date(order._id); // <-- utilise _id pour la date
        return orderDate >= yearStart && orderDate <= yearEnd;
      });
      this.updateLineChart(filteredData);
    });
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
