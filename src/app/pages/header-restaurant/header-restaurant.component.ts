import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header-restaurant',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header-restaurant.component.html',
  styleUrls: ['./header-restaurant.component.css']
})
export class HeaderRestaurantComponent implements OnInit {
  activeLink = 'accueil';
  dropdownOpen = false;
  mobileMenuOpen = false;

  showProfileModal = false;
  firstName = '';
  lastName = '';
  email = '';
  phone = '';

  uploadedFiles: Record<string, File | null> = {
    permis: null,
    certificat: null,
    autresDocs: null,
    idCardCopy: null,
    photo: null,
  };

  uploadedFilesUrl: Record<string, string | null> = {
    permisUrl: null,
    certificatUrl: null,
    autresDocsUrl: null,
    idCardCopyUrl: null,
    photoUrl: null,
  };

  showPasswordModal = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';
  passwordSuccess = '';

  // Modals succès/erreur
  showSuccessModal = false;
  showErrorModal = false;
  modalMessage = '';

  isBrowser: boolean;
  isRestaurant = true; // ✅ Ajouté


  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.authService.getRestaurantProfile().subscribe({
        next: (res: any) => {
          if (res?.restaurant) {
            this.isRestaurant = true; // ✅ On sait que c'est un restaurant
            this.loadProfile(res.restaurant);
          } else {
            this.isRestaurant = false;

          }
        },
        error: (err) => {
          console.error('Erreur récupération du profil:', err);
          this.isRestaurant = false;
        }
      });
    }
  }

  setActive(link: string) {
    this.activeLink = link;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  loadProfile(r: any) {
    if (r.managerName) {
      const parts = r.managerName.split(' ');
      this.firstName = parts[1] || '';
      this.lastName = parts[0] || '';
    } else {
      this.firstName = '';
      this.lastName = '';
    }

    this.email = r.email || '';
    this.phone = r.phone || '';

    const baseUrl = environment.apiUrl + '/';

    this.uploadedFilesUrl['permisUrl'] = r.permis ? baseUrl + r.permis : null;
    this.uploadedFilesUrl['certificatUrl'] = r.certificat ? baseUrl + r.certificat : null;
    this.uploadedFilesUrl['autresDocsUrl'] = r.autresDocs ? baseUrl + r.autresDocs : null;
    this.uploadedFilesUrl['idCardCopyUrl'] = r.idCardCopy ? baseUrl + r.idCardCopy : null;
    this.uploadedFilesUrl['photoUrl'] = r.photo ? baseUrl + r.photo : null;
  }

  goToProfile() {
    this.dropdownOpen = false;
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files?.[0] || null;
    if (file) {
      this.uploadedFiles[field] = file;
    }
  }

  saveProfile() {
    const formData = new FormData();

    formData.append('managerName', `${this.lastName} ${this.firstName}`.trim());
    formData.append('email', this.email);
    formData.append('phone', this.phone);

    Object.entries(this.uploadedFiles).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    this.authService.updateProfile(formData).subscribe({
      next: () => {
        this.openSuccessModal('Profil mis à jour avec succès.');
        this.showProfileModal = false;
        this.ngOnInit(); // Recharge le composant pour rafraîchir les données
      },
      error: (err) => {
        console.error('Erreur mise à jour profil:', err);
        this.openErrorModal('Erreur lors de la mise à jour du profil.');
      }
    });
  }

  changePassword() {
    this.dropdownOpen = false;
    this.showPasswordModal = true;
    this.clearPasswordFields();
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.clearPasswordFields();
  }

  clearPasswordFields() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  submitPasswordChange() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.openSuccessModal('Mot de passe modifié avec succès.');
        this.closePasswordModal();
      },
      error: (err) => {
        console.error('Erreur changement mot de passe:', err);
        this.passwordError = err.error?.message || 'Erreur lors du changement de mot de passe.';
        this.openErrorModal(this.passwordError);
      }
    });
  }

  logout() {
  this.authService.logout();
  localStorage.clear(); // 🧹 Vider entièrement le localStorage
  this.dropdownOpen = false;
  this.router.navigate(['/login']);
}


  openSuccessModal(message: string) {
    this.modalMessage = message;
    this.showSuccessModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.modalMessage = '';
  }

  openErrorModal(message: string) {
    this.modalMessage = message;
    this.showErrorModal = true;
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.modalMessage = '';
  }
}
