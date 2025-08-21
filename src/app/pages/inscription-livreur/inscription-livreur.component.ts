import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HeaderLComponent } from "../header-l/header-l.component";
import { FooterComponent } from "../footer/footer.component";
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
  styleUrls: ['./inscription-livreur.component.css']
})
export class InscriptionLivreurComponent {
  email: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  validateEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email);
  }

  preRegisterLivreur(): void {
    if (!this.isBrowser) return; // ⛔ ne rien exécuter côté serveur

    if (!this.validateEmail()) {
      this.errorMessage = "Veuillez saisir une adresse email valide.";
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.preRegisterLivreur(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        alert("Inscription réussie ! Un mot de passe a été envoyé à votre email.");
        this.router.navigate(['/connexion-livreur']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || "Une erreur est survenue.";
      }
    });
  }
}
