import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderLComponent } from "../header-l/header-l.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inscription-l-complet',
  standalone: true,
  imports: [FooterComponent, HeaderLComponent, CommonModule, FormsModule],
  templateUrl: './inscription-l-complet.component.html',
  styleUrl: './inscription-l-complet.component.css'
})
export class InscriptionLCompletComponent {
  sectionOpen: any;
toggleDropdown(id: string) {
    const content = document.getElementById(id);
    if (content) {
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    }
  }

  saveAll() {
    // Logique pour enregistrer les données de tous les formulaires
    alert('Tous les formulaires ont été enregistrés.');
  }

}
