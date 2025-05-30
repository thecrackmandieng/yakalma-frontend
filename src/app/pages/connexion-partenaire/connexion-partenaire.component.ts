import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderPComponent } from "../header-p/header-p.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-connexion-partenaire',
  standalone: true,
  imports: [HeaderPComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './connexion-partenaire.component.html',
  styleUrls: ['./connexion-partenaire.component.css']
})
export class ConnexionPartenaireComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isEmailValid: boolean = false;
  isPasswordValid: boolean = false;

  constructor(private router: Router) {}

  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailRegex.test(this.email);
    this.updateErrorMessage();
  }

  validatePassword() {
    this.isPasswordValid = this.password.length >= 6; // Exemple : mot de passe doit avoir au moins 6 caractères
    this.updateErrorMessage();
  }

  updateErrorMessage() {
    if (!this.isEmailValid && this.email) {
      this.errorMessage = 'Veuillez entrer un email valide.';
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
    if (this.email === 'partenaire@gmail.com' && this.password === 'password') {
      this.router.navigate(['/restaurant/dashboard']);
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Email ou mot de passe incorrect.';
    }
  }
}
