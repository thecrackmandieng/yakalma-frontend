import { Component } from '@angular/core';
import { HeaderLComponent } from "../header-l/header-l.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inscription-livreur',
  standalone: true,
  imports: [
    HeaderLComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './inscription-livreur.component.html',
  styleUrl: './inscription-livreur.component.css'
})
export class InscriptionLivreurComponent {
  email: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // ✅ Validation simple de l'email
  validateEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email);
  }

  // ✅ Appel du service pour préinscription
  preRegisterLivreur(): void {
    if (!this.validateEmail()) {
      this.errorMessage = "Veuillez saisir une adresse email valide.";
      return;
    }

    this.authService.preRegisterLivreur(this.email).subscribe({
      next: () => {
        alert("Inscription réussie ! Un mot de passe a été envoyé à votre email.");
        this.router.navigate(['/connexion-livreur']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || "Une erreur est survenue.";
      }
    });
  }
}
