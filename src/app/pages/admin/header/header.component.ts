import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthAdminService } from '../../../services/auth-admin.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  dropdownOpen = false;

  // Profil modal
  showProfileModal = false;
  firstName = '';
  lastName = '';
  email = '';
  phone = '';

  // Mot de passe modal
  showPasswordModal = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';

  constructor(
    private authService: AuthAdminService,
    private router: Router
  ) {}

  ngOnInit() {
    if (typeof localStorage !== 'undefined' && this.authService.isLoggedIn()) {
      this.loadProfile();
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToProfile() {
    this.dropdownOpen = false;
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        if (res.admin && res.admin.name) {
          const names = res.admin.name.split(' ');
          this.firstName = names[0] || '';
          this.lastName = names[1] || '';
        }
        this.email = res.admin.email || '';
        this.phone = res.admin.phone || '';
      },
      error: (err) => {
        console.error('Erreur chargement profil', err);
      }
    });
  }

saveProfile() {
  const profileData = {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone
  };

  this.authService.updateProfile(profileData).subscribe({
    next: (res) => {
      alert('Profil mis à jour avec succès.');
      this.showProfileModal = false;
    },
    error: (err) => {
      console.error('Erreur mise à jour profil', err);
      alert('Erreur lors de la mise à jour du profil.');
    }
  });
}

  changePassword() {
    this.dropdownOpen = false;
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
  }

  submitPasswordChange() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        alert('Mot de passe modifié avec succès.');
        this.closePasswordModal();
      },
      error: (err) => {
        this.passwordError = err.error?.message || 'Erreur lors du changement de mot de passe.';
        console.error(err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.dropdownOpen = false;
    this.router.navigate(['/login']);
  }
}
