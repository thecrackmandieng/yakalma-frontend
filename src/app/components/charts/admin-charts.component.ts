import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-admin-charts',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <!-- Graphique historique des commandes -->
      <div class="bg-white rounded-xl shadow p-4">
        <h3 class="text-base font-semibold mb-3 text-gray-700">Historique des Commandes</h3>
        <canvas baseChart
          [data]="lineChartData"
          [options]="lineChartOptions"
          [type]="lineChartType"
          class="w-full h-56"></canvas>
        <div class="flex flex-wrap justify-center mt-4">
          <button (click)="filterByWeek.emit()" class="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 mr-2">Semaine</button>
          <button (click)="filterByMonth.emit()" class="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 mr-2">Mois</button>
          <button (click)="filterByYear.emit()" class="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300">Année</button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-4">
        <h3 class="text-base font-semibold mb-3 text-gray-700">Encaissements Restaurants vs Livreurs</h3>
        <canvas baseChart
          [data]="barChartData"
          [options]="barChartOptions"
          [type]="barChartType"
          class="w-full h-56"></canvas>
      </div>

      <div class="bg-white rounded-xl shadow p-4">
        <h3 class="text-base font-semibold mb-3 text-gray-700">Répartition Utilisateurs</h3>
        <canvas baseChart
          [data]="doughnutChartData"
          [options]="doughnutChartOptions"
          [type]="doughnutChartType"
          class="w-full h-56"></canvas>
      </div>
    </div>
  `
})
export class AdminChartsComponent implements OnInit {
  @Input() lineChartData!: ChartData<'line'>;
  @Input() lineChartOptions!: ChartOptions<'line'>;
  @Input() lineChartType: 'line' = 'line';

  @Input() barChartData!: ChartData<'bar'>;
  @Input() barChartOptions!: ChartOptions<'bar'>;
  @Input() barChartType: 'bar' = 'bar';

  @Input() doughnutChartData!: ChartData<'doughnut'>;
  @Input() doughnutChartOptions!: ChartOptions<'doughnut'>;
  @Input() doughnutChartType: 'doughnut' = 'doughnut';

  @Output() filterByWeek = new EventEmitter<void>();
  @Output() filterByMonth = new EventEmitter<void>();
  @Output() filterByYear = new EventEmitter<void>();

  ngOnInit(): void {
    // Les graphiques ne seront rendus que côté client
  }
}
