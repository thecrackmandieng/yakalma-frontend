import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthAdminService } from '../../../services/auth-admin.service';
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
  isEmailValid: boolean = false;
  isPasswordValid: boolean = false;
  isLoading: boolean = false;
  isBrowser: boolean;

  constructor(
    private authAdminService: AuthAdminService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  onLogin(): void {
    if (!this.isFormValid()) {
      this.errorMessage = "Veuillez remplir correctement le formulaire.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authAdminService.login(this.emailOrPhone, this.password).subscribe({
      next: (response) => {
        if (this.isBrowser) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.admin?.role || '');
        }
        this.redirectBasedOnRole(response.admin?.role || '');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur de connexion :', error);
        this.errorMessage =
          error.error?.message || 'Identifiants invalides ou serveur indisponible.';
        this.isLoading = false;
      },
    });
  }

  validateEmailOrPhone(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{8,14}$/;
    this.isEmailValid = emailRegex.test(this.emailOrPhone) || phoneRegex.test(this.emailOrPhone);
    this.updateErrorMessage();
  }

  validatePassword(): void {
    this.isPasswordValid = this.password.length >= 6;
    this.updateErrorMessage();
  }

  updateErrorMessage(): void {
    if (!this.isEmailValid && this.emailOrPhone) {
      this.errorMessage = 'Veuillez entrer un email ou numéro valide.';
    } else if (!this.isPasswordValid && this.password) {
      this.errorMessage = 'Le mot de passe doit avoir au moins 6 caractères.';
    } else {
      this.errorMessage = '';
    }
  }

  isFormValid(): boolean {
    this.validateEmailOrPhone();
    this.validatePassword();
    return this.isEmailValid && this.isPasswordValid;
  }

  private redirectBasedOnRole(role: string): void {
    if (!this.isBrowser) return;

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
