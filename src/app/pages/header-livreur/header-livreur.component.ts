import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-livreur',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header-livreur.component.html',
  styleUrls: ['./header-livreur.component.css']
})
export class HeaderLivreurComponent {
  activeLink = 'accueil';
  showInput = false;
  validationCode: string = '';
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage: string = '';

  setActive(link: string) {
    this.activeLink = link;
  }

  toggleInput() {
    this.showInput = true;
  }

  validateCode() {
    if (/^\d{4}$/.test(this.validationCode)) {
      console.log('Code validé');
      this.showInput = false;
      this.showSuccessModal = true;

      setTimeout(() => {
        this.showSuccessModal = false;
      }, 2000);
    } else {
      this.errorMessage = 'Le code doit être un nombre à 4 chiffres.';
      this.showErrorModal = true;

      setTimeout(() => {
        this.showErrorModal = false;
      }, 2000);
    }
  }
}
