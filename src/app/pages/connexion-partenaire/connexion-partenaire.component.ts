import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { HeaderPComponent } from "../header-p/header-p.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-connexion-partenaire',
  standalone: true,
  imports: [HeaderPComponent, FooterComponent, FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './connexion-partenaire.component.html',
  styleUrls: ['./connexion-partenaire.component.css']
})
export class ConnexionPartenaireComponent {
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
    this.isPasswordValid = this.password.length >= 6;
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
    this.validateEmailOrPhone();
    this.validatePassword();
    return this.isEmailValid && this.isPasswordValid;
  }

 onLogin() {
  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      console.log("✅ Connexion partenaire réussie:", res);

      if (res.token && res.user) {
        const role = res.user.role?.toLowerCase();
        const status = res.user.status?.toLowerCase();

        // ✅ Sauvegarde dans localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('profile', JSON.stringify(res.user));
        localStorage.setItem('role', role); // ✅ Stockage du rôle séparément

        if (role === 'restaurant') {
          if (status === 'approved') {
            this.router.navigate(['/restaurant/dashboard']);
          } else if (status === 'pending' || status === 'incomplete') {
            this.router.navigate(['/inscription-p-complet']);
          } else if (status === 'rejected') {
            this.errorMessage = "❌ Votre inscription a été refusée.";
          } else if (status === 'blocked') {
            this.errorMessage = "🚫 Votre compte a été bloqué.";
          } else {
            this.errorMessage = "⚠️ Statut de compte inconnu.";
          }
        } else {
          this.errorMessage = "❌ Accès réservé aux comptes restaurants.";
        }
      } else {
        this.errorMessage = "❌ Réponse invalide du serveur.";
      }
    },
    error: (err) => {
      console.error("❌ Erreur login partenaire:", err);
      this.errorMessage = err?.error?.message || "Erreur de connexion.";
    }
  });
}


  setTemporaryError(msg: string) {
    this.errorMessage = msg;
    setTimeout(() => this.errorMessage = '', 5000);
  }
}
