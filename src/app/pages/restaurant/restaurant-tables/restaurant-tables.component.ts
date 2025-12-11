import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TablesService, Table } from '../../../services/tables.service';
import { FormsModule } from '@angular/forms';
import * as QRCode from 'qrcode';
import { HeaderRestaurantComponent } from "../../header-restaurant/header-restaurant.component";
import { FooterComponent } from "../../footer/footer.component";
import { environment } from '../../../../environments/environment';

interface Menu {
  id: string;
  name: string;
}

@Component({
  selector: 'app-restaurant-tables',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderRestaurantComponent, FooterComponent],
  templateUrl: './restaurant-tables.component.html',
  styleUrls: ['./restaurant-tables.component.css']
})
export class RestaurantTablesComponent implements OnInit {
  tables: Table[] = [];
  menus: Menu[] = [];
  restaurantId: string = '';
  isBrowser: boolean;
  showRegisterModal = false;
  newTableName = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private tablesService: TablesService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    console.log('🚀 Initialisation du composant RestaurantTablesComponent');
    if (this.isBrowser) {
      console.log('🌐 Environnement browser détecté, chargement des données...');
      this.loadRestaurantData();
    } else {
      console.log('🖥️ Environnement serveur détecté, pas de chargement des données');
    }
  }

  loadRestaurantData() {
    console.log('🔍 Chargement des données du restaurant...');
    this.authService.getRestaurantProfile().subscribe({
      next: (res: any) => {
        console.log('📋 Réponse complète du profil restaurant:', res);
        console.log('📋 Restaurant dans la réponse:', res?.restaurant);
        if (res?.restaurant) {
          this.restaurantId = res.restaurant._id;
          this.menus = res.restaurant.menus || [];
          console.log('✅ Restaurant ID:', this.restaurantId);
          console.log('📋 Menus:', this.menus);
          console.log('📋 Nombre de menus:', this.menus.length);
          // Load tables after restaurant data is loaded
          this.loadTables();
        } else {
          console.error('❌ Structure de réponse inattendue:', res);
          console.error('❌ Propriétés de la réponse:', Object.keys(res || {}));
        }
      },
      error: (err) => {
        console.error('❌ Erreur récupération du profil:', err);
        console.error('❌ Détails de l\'erreur:', err.message || err);
      }
    });
  }

  loadTables() {
    console.log('📋 Chargement des tables depuis l\'API...');
    this.isLoading = true;

    this.tablesService.getTables().subscribe({
      next: (response: any) => {
        console.log('✅ Réponse complète de l\'API tables:', response);
        console.log('✅ Tables récupérées:', response);
        console.log('✅ Nombre de tables:', response?.tables ? response.tables.length : 'undefined');
        this.tables = response?.tables || [];
        this.isLoading = false;
        console.log('📋 Tables assignées au composant:', this.tables);
        // Générer les QR codes pour toutes les tables
        this.generateQRCodes();
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des tables:', err);
        this.tables = [];
        this.isLoading = false;
      }
    });
  }

  generateQRCodes() {
    console.log('🔄 Génération des QR codes...');
    console.log('🏪 Restaurant ID:', this.restaurantId);
    console.log('🌐 Frontend URL:', environment.frontendUrl);

    this.tables.forEach(table => {
      const menuUrl = `${environment.frontendUrl}/restaurant/${this.restaurantId}/menu?table=${table._id}`;
      console.log(`📱 Génération QR pour table ${table.name}:`, menuUrl);

      QRCode.toDataURL(menuUrl, (err, url) => {
        if (err) {
          console.error(`❌ Erreur génération QR pour table ${table.name}:`, err);
        } else {
          console.log(`✅ QR généré pour table ${table.name}`);
          table.qrCode = url;
        }
      });
    });
  }

  openRegisterModal() {
    this.showRegisterModal = true;
    this.newTableName = '';
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
  }

  registerTable() {
    if (!this.newTableName.trim()) return;

    console.log('📝 Création d\'une nouvelle table:', this.newTableName);
    this.isLoading = true;

    this.tablesService.createTable(this.newTableName.trim(), this.restaurantId).subscribe({
      next: (response) => {
        console.log('✅ Table créée:', response.table);
        this.tables.push(response.table);
        this.isLoading = false;
        this.closeRegisterModal();
        this.newTableName = '';
        // Générer le QR code pour la nouvelle table
        this.generateQRCodes();
      },
      error: (err) => {
        console.error('❌ Erreur lors de la création de la table:', err);
        this.isLoading = false;
      }
    });
  }

  downloadQR(table: Table) {
    const link = document.createElement('a');
    link.href = table.qrCode;
    link.download = `table-${table.name}-qr.png`;
    link.click();
  }

  deleteTable(table: Table) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la table "${table.name}" ?`)) {
      console.log('🗑️ Suppression de la table:', table.name);
      this.isLoading = true;

      this.tablesService.deleteTable(table._id).subscribe({
        next: (response) => {
          console.log('✅ Table supprimée:', response.message);
          this.tables = this.tables.filter(t => t._id !== table._id);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression de la table:', err);
          this.isLoading = false;
        }
      });
    }
  }
}
