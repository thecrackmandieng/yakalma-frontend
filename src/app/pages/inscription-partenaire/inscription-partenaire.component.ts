import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderPComponent } from "../header-p/header-p.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { PartenaireService } from '../../services/partenaire.service'; // adapte le chemin si nécessaire

@Component({
  selector: 'app-inscription-partenaire',
  standalone: true,
  templateUrl: './inscription-partenaire.component.html',
  styleUrls: ['./inscription-partenaire.component.css'],
  imports: [
    FooterComponent,
    HeaderPComponent,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class InscriptionPartenaireComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private partenaireService: PartenaireService,
    private router: Router
  ) {}

  onContinue(): void {
    if (!this.email || !this.email.includes('@')) {
      this.errorMessage = 'Veuillez saisir une adresse email valide.';
      return;
    }

    this.partenaireService.preRegisterPartenaire(this.email).subscribe({
      next: (response) => {
        this.successMessage = 'Email enregistré avec succès. Redirection...';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/inscription-p-complet'], {
            queryParams: { email: this.email }
          });
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || "Une erreur s'est produite.";
        this.successMessage = '';
      }
    });
  }
}
