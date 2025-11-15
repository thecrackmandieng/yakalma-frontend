import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import * as QRCode from 'qrcode';
import { HeaderRestaurantComponent } from "../../header-restaurant/header-restaurant.component";
import { FooterComponent } from "../../footer/footer.component";
import { environment } from '../../../../environments/environment';

interface Table {
  id: string;
  name: string;
  qrCode: string;
}

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

  constructor(
    private authService: AuthService,
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
      this.loadTables();
    } else {
      console.log('🖥️ Environnement serveur détecté, pas de chargement des données');
    }
  }

  loadRestaurantData() {
    console.log('🔍 Chargement des données du restaurant...');
    this.authService.getRestaurantProfile().subscribe({
      next: (res: any) => {
        console.log('📋 Réponse du profil restaurant:', res);
        if (res?.restaurant) {
          this.restaurantId = res.restaurant._id;
          this.menus = res.restaurant.menus || [];
          console.log('✅ Restaurant ID:', this.restaurantId);
          console.log('📋 Menus:', this.menus);
        } else {
          console.error('❌ Structure de réponse inattendue:', res);
        }
      },
      error: (err) => {
        console.error('❌ Erreur récupération du profil:', err);
      }
    });
  }

  loadTables() {
    console.log('📋 Chargement des tables...');
    // Assume there's a service method to get tables
    // For now, using mock data
    this.tables = [
      { id: '1', name: 'Table 1', qrCode: '' },
      { id: '2', name: 'Table 2', qrCode: '' },
    ];
    console.log('📋 Tables mockées:', this.tables);
    this.generateQRCodes();
  }

  generateQRCodes() {
    console.log('🔄 Génération des QR codes...');
    console.log('🏪 Restaurant ID:', this.restaurantId);
    console.log('🌐 Frontend URL:', environment.frontendUrl);

    this.tables.forEach(table => {
      const menuUrl = `${environment.frontendUrl}/restaurant/${this.restaurantId}/menu`;
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

    // Assume there's a service method to register table
    const newTable: Table = {
      id: Date.now().toString(),
      name: this.newTableName,
      qrCode: ''
    };

    this.tables.push(newTable);
    this.generateQRCodes();
    this.closeRegisterModal();
  }

  downloadQR(table: Table) {
    const link = document.createElement('a');
    link.href = table.qrCode;
    link.download = `table-${table.name}-qr.png`;
    link.click();
  }
}
