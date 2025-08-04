import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { HeaderLComponent } from "../header-l/header-l.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-connexion-livreur',
  standalone: true,
  imports: [HeaderLComponent, FooterComponent, FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './connexion-livreur.component.html',
  styleUrls: ['./connexion-livreur.component.css']
})
export class ConnexionLivreurComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isEmailValid: boolean = false;
  isPasswordValid: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  validateEmailOrPhone() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{8,14}$/;
    this.isEmailValid = emailRegex.test(this.email) || phoneRegex.test(this.email);
    this.updateErrorMessage();
  }

  validatePassword() {
    this.isPasswordValid = this.password.length >= 4;
    this.updateErrorMessage();
  }

  updateErrorMessage() {
    if (!this.isEmailValid && this.email) {
      this.errorMessage = 'Veuillez entrer un email ou numéro valide.';
    } else if (!this.isPasswordValid && this.password) {
      this.errorMessage = 'Le mot de passe doit avoir au moins 6 caractères.';
    } else {
      this.errorMessage = '';
    }
  }

  isFormValid() {
    return this.isEmailValid && this.isPasswordValid;
  }

onLogin() {
  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      console.log("✅ Login réussi:", res);

      if (res.token && res.user) {
        const role = res.user.role?.toLowerCase();
        const status = res.user.status?.toLowerCase();

        if (role === 'livreur') {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          if (status === 'approved') {
            this.router.navigate(['/livreur/dashboard']);
          } else if (status === 'pending' || status === 'incomplete') {
            this.router.navigate(['/inscription-l-complet']);
          } else if (status === 'rejected') {
            this.errorMessage = "❌ Votre inscription a été refusée.";
          } else if (status === 'blocked') {
            this.errorMessage = "🚫 Votre compte a été bloqué.";
          } else {
            this.errorMessage = "⚠️ Statut de compte inconnu.";
          }
        } else {
          this.errorMessage = "❌ Vous n'êtes pas autorisé à accéder à cette section.";
        }
      } else {
        this.errorMessage = "❌ Réponse invalide du serveur.";
      }
    },
    error: (err) => {
      console.error("❌ Erreur:", err);
      this.errorMessage = err.error?.message || 'Erreur de connexion.';
    }
  });
}

setTemporaryError(msg: string) {
  this.errorMessage = msg;
  setTimeout(() => this.errorMessage = '', 5000);
}



}
