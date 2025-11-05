import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import * as QRCode from 'qrcode';
import { HeaderRestaurantComponent } from "../../header-restaurant/header-restaurant.component";
import { FooterComponent } from "../../footer/footer.component";

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
    if (this.isBrowser) {
      this.loadRestaurantData();
      this.loadTables();
    }
  }

  loadRestaurantData() {
    this.authService.getRestaurantProfile().subscribe({
      next: (res: any) => {
        if (res?.restaurant) {
          this.restaurantId = res.restaurant.id;
          this.menus = res.restaurant.menus || [];
        }
      },
      error: (err) => {
        console.error('Erreur récupération du profil:', err);
      }
    });
  }

  loadTables() {
    // Assume there's a service method to get tables
    // For now, using mock data
    this.tables = [
      { id: '1', name: 'Table 1', qrCode: '' },
      { id: '2', name: 'Table 2', qrCode: '' },
    ];
    this.generateQRCodes();
  }

  generateQRCodes() {
    this.tables.forEach(table => {
      const menuUrl = `${window.location.origin}/restaurant/${this.restaurantId}/menu`;

      QRCode.toDataURL(menuUrl, (err, url) => {
        if (!err) {
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
