import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthAdminService } from '../../../services/auth-admin.service'; // ✅ Ton service admin
import { FooterComponent } from "../../footer/footer.component";
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    FooterComponent,
    HeaderComponent
  ],
})
export class LoginComponent {
  emailOrPhone: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authAdminService: AuthAdminService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.authAdminService.login(this.emailOrPhone, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.admin?.role || '');
        this.redirectBasedOnRole(response.admin?.role || '');
      },
      error: (error) => {
        console.error('Erreur de connexion :', error);
        this.errorMessage = error.error?.message || 'Identifiants invalides ou serveur indisponible.';
      },
    });
  }

  validateEmailOrPhone(): void {
    this.errorMessage = '';
  }

  validatePassword(): void {
    this.errorMessage = '';
  }

  isFormValid(): boolean {
    return this.emailOrPhone.trim() !== '' && this.password.trim() !== '';
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'Admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'restaurant':
        this.router.navigate(['/restaurant/dashboard']);
        break;
      case 'livreur':
        this.router.navigate(['/livreur/dashboard']);
        break;
      default:
        this.router.navigate(['/client/dashboard']);
        break;
    }
  }
}
