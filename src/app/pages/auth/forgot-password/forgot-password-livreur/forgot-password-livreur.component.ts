import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HeaderPComponent } from '../../../header-p/header-p.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../../../footer/footer.component';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-forgot-password-livreur',
  standalone: true,
  imports: [HeaderPComponent, FooterComponent, FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './forgot-password-livreur.component.html',
  styleUrl: './forgot-password-livreur.component.css'
})
export class ForgotPasswordLivreurComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isEmailValid: boolean = false;
  isBrowser: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailRegex.test(this.email);
    this.updateErrorMessage();
  }

  updateErrorMessage() {
    if (!this.isEmailValid && this.email) {
      this.errorMessage = 'Veuillez entrer une adresse email valide.';
    } else {
      this.errorMessage = '';
    }
  }

  isFormValid() {
    this.validateEmail();
    return this.isEmailValid;
  }

  onResetPassword() {
    if (!this.isFormValid()) {
      this.errorMessage = "Veuillez entrer une adresse email valide.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulation de l'envoi de l'email de réinitialisation
    // Dans un vrai projet, vous appelleriez votre API ici
    setTimeout(() => {
      this.successMessage = "Un email de réinitialisation a été envoyé à votre adresse si elle existe dans notre système.";
      this.isLoading = false;

      // Redirection automatique après 3 secondes
      if (this.isBrowser) {
        setTimeout(() => {
          this.router.navigate(['/connexion-livreur']);
        }, 3000);
      }
    }, 1500);
  }
}
