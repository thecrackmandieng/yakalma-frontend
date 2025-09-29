import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderPComponent } from "../header-p/header-p.component";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inscription-p-complet',
  standalone: true,
  imports: [FooterComponent, HeaderPComponent, CommonModule, FormsModule],
  templateUrl: './inscription-p-complet.component.html',
  styleUrls: ['./inscription-p-complet.component.css']
})
export class InscriptionPCompletComponent {
  sectionOpen: string = '';
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  // Données texte
  formData = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    nomResto: '',
    adresse: '',
    ville: '',
    codePostal: '',
    ninea: ''
  };

  // Fichiers (clé = nom des champs côté backend)
  files: { [key: string]: File | null } = {
    permis: null,
    certificat: null,
    autresDocs: null,
    idCardCopy: null,
    photo: null  // ✅ nouveau champ ajouté
  };

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

  saveAll(personalForm: NgForm, restaurantForm: NgForm, papersForm: NgForm) {
    this.successMessage = '';
    this.errorMessage = '';
    this.isLoading = true; // ✅ loader start

    // Validation des champs
    if (personalForm.invalid || restaurantForm.invalid || papersForm.invalid) {
      this.errorMessage = "Veuillez remplir tous les champs correctement.";
      this.isLoading = false;
      return;
    }

    // Validation fichiers
    if (!this.files['permis'] || !this.files['certificat'] || !this.files['idCardCopy'] || !this.files['photo']) {
      this.errorMessage = "Tous les fichiers sont requis.";
      this.isLoading = false;
      return;
    }

    const payload = new FormData();

    // Données textes
    payload.append('name', this.formData.nomResto);
    payload.append('address', this.formData.adresse);
    payload.append('phone', this.formData.telephone);
    payload.append('email', this.formData.email);
    payload.append('managerName', `${this.formData.nom} ${this.formData.prenom}`.trim());
    payload.append('ninea', this.formData.ninea);

    // Fichiers (les noms doivent correspondre aux champs attendus par le backend)
    payload.append('permis', this.files['permis']!);
    payload.append('certificat', this.files['certificat']!);
    payload.append('autresDocs', this.files['autresDocs']!);
    payload.append('idCardCopy', this.files['idCardCopy']!);
    payload.append('photo', this.files['photo']!);  // ✅ nouveau champ

    // Appel API
    this.authService.registerPartenaire(payload).subscribe({
      next: () => {
        this.successMessage = "Inscription réussie. En attente de validation.";
        this.errorMessage = '';
        this.isLoading = false; // ✅ loader stop
        this.router.navigate(['/connexion-partenaire']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.message || "Une erreur est survenue lors de l'inscription.";
        this.isLoading = false; // ✅ loader stop
      }
    });
  }
}
