import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PartenaireService } from '../../services/partenaire.service';

@Component({
  selector: 'app-header-livreur',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header-livreur.component.html',
  styleUrls: ['./header-livreur.component.css']
})
export class HeaderLivreurComponent implements OnInit {
  activeLink = 'accueil';
  showInput = false;
  validationCode = '';
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';

  dropdownOpen = false;
  showProfileModal = false;
  showPasswordModal = false;

  firstName = '';
  lastName = '';
  email = '';
  phone = '';

  profileImage: File | null = null;
  idDocument: File | null = null;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private partenaireService: PartenaireService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getLivreurProfile().subscribe({
      next: (res: any) => {
        const profile = res?.livreur || res?.restaurant || res?.user || null;

        if (profile) {
          const nameParts = (profile.name || '').split(' ');
          this.firstName = nameParts[0] ?? '';
          this.lastName = nameParts.slice(1).join(' ') ?? '';

          this.email = profile.email ?? '';
          this.phone = profile.phone ?? '';
        } else {
          console.warn('Aucun profil valide trouvé dans la réponse.');
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil :', err);
      }
    });
  }

  setActive(link: string): void {
    this.activeLink = link;
  }

  toggleInput(): void {
    this.showInput = true;
  }

  validateCode(): void {
    if (!this.validationCode) {
      this.showErrorMessage('Veuillez saisir le code de validation.');
      return;
    }

    this.partenaireService.validateOrderWithCode(this.validationCode).subscribe({
      next: () => {
        this.showInput = false;
        this.validationCode = '';
        this.showSuccessMessage('Commande validée avec succès. Elle a été supprimée côté restaurant.');
      },
      error: (err: any) => {
        console.error('Erreur validation code:', err);
        this.showErrorMessage('Code de validation incorrect ou commande introuvable.');
      }
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToProfile(): void {
    this.dropdownOpen = false;
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.profileImage = input.files[0];
    }
  }

  onDocumentChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.idDocument = input.files[0];
    }
  }

saveProfile(): void {
  const formData = new FormData();
  formData.append('name', `${this.firstName} ${this.lastName}`.trim());
  formData.append('email', this.email);
  formData.append('phone', this.phone);

  if (this.profileImage) formData.append('image', this.profileImage);
  if (this.idDocument) formData.append('document', this.idDocument);

  const currentUser = this.authService.getCurrentUser();
  const livreurId = currentUser?._id;

  if (!livreurId) {
    this.showErrorMessage('Impossible de récupérer l\'identifiant du livreur.');
    return;
  }

  this.authService.updateLivreurProfile(livreurId, formData).subscribe({
    next: () => {
      this.closeProfileModal();
      this.showSuccessMessage('Profil mis à jour avec succès');
      this.loadProfile();
    },
    error: (err) => {
      console.error('Erreur lors de la mise à jour du profil :', err);
      this.showErrorMessage('Erreur lors de la mise à jour du profil');
    }
  });
}


  changePassword(): void {
    this.dropdownOpen = false;
    this.showPasswordModal = true;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
  }

submitPasswordChange(): void {
  if (this.newPassword !== this.confirmPassword) {
    this.passwordError = 'Les mots de passe ne correspondent pas.';
    return;
  }

  const payload = {
    currentPassword: this.currentPassword,
    newPassword: this.newPassword
  };

  // Appel à la bonne méthode changeLivreurPassword du service AuthService
  this.authService.changeLivreurPassword(payload).subscribe({
    next: () => {
      this.closePasswordModal();
      this.showSuccessMessage('Mot de passe changé avec succès');
    },
    error: () => {
      this.passwordError = 'Erreur lors du changement de mot de passe.';
    }
  });
}

logout() {
  this.authService.logout();
  localStorage.clear(); // 🧹 Vider entièrement le localStorage
  this.dropdownOpen = false;
  this.router.navigate(['/login']);
}

  private showSuccessMessage(message: string): void {
    this.errorMessage = message;
    this.showSuccessModal = true;
    setTimeout(() => {
      this.showSuccessModal = false;
      this.errorMessage = '';
    }, 2000);
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showErrorModal = true;
    setTimeout(() => {
      this.showErrorModal = false;
      this.errorMessage = '';
    }, 2000);
  }
}
