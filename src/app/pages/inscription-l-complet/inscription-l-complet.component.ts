import { Component } from '@angular/core';
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
  templateUrl: './inscription-l-complet.component.html',
  styleUrls: ['./inscription-l-complet.component.css']
})
export class InscriptionLCompletComponent {
  sectionOpen: string = '';
  successMessage = '';
  errorMessage = '';

  formData: any = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    typeVehicule: '',
    immatriculation: ''
  };

  files: { [key: string]: File } = {};

  constructor(private authService: AuthService, private router: Router) {}

  toggleDropdown(id: string) {
    const content = document.getElementById(id);
    if (content) {
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    }
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      this.files[type] = file;
    }
  }

  saveAll() {
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
        this.successMessage = 'Inscription réussie. En attente de validation.';
        this.errorMessage = '';
        this.router.navigate(['/connexion-livreur']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || "Erreur lors de l'inscription.";
        this.successMessage = '';
      }
    });
  }
}
