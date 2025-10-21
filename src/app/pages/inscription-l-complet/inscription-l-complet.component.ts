import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { HeaderLComponent } from "../header-l/header-l.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription-l-complet',
  standalone: true,
  imports: [FooterComponent, HeaderLComponent, CommonModule, FormsModule],
  templateUrl: './inscription-l-complet.component.html'
})
export class InscriptionLCompletComponent {
  sectionOpen: string = '';
  successMessage = '';
  errorMessage = '';
  isLoading = false;
  isBrowser: boolean;

  formData: any = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    typeVehicule: '',
    immatriculation: ''
  };

  files: { [key: string]: File } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  toggleDropdown(id: string) {
    if (this.isBrowser) {
      const content = document.getElementById(id);
      if (content) {
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      }
    }
  }

  onFileSelected(event: any, type: string) {
    if (this.isBrowser) {
      const file = event.target.files[0];
      if (file) {
        this.files[type] = file;
      }
    }
  }

  saveAll() {
    this.isLoading = true;

    const formDataToSend = new FormData();
    formDataToSend.append('name', `${this.formData.nom} ${this.formData.prenom}`);
    formDataToSend.append('email', this.formData.email);
    formDataToSend.append('phone', this.formData.telephone);
    formDataToSend.append('vehicleType', this.formData.typeVehicule);
    formDataToSend.append('vehicleNumber', this.formData.immatriculation);

    if (this.files['carteGrise']) {
      formDataToSend.append('idCardCopy', this.files['carteGrise']);
    }
    if (this.files['assurance']) {
      formDataToSend.append('insuranceCopy', this.files['assurance']);
    }

    this.authService.registerLivreur(formDataToSend).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Inscription réussie. En attente de validation.';
        this.errorMessage = '';
        this.router.navigate(['/connexion-livreur']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'inscription.";
        this.successMessage = '';
      }
    });
  }
}
