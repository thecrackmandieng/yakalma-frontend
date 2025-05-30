import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderPComponent } from "../header-p/header-p.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-inscription-p-complet',
  standalone: true,
  imports: [FooterComponent, HeaderPComponent, CommonModule, FormsModule],
  templateUrl: './inscription-p-complet.component.html',
  styleUrl: './inscription-p-complet.component.css'
})
export class InscriptionPCompletComponent {
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
