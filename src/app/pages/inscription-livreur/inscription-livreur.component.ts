import { Component } from '@angular/core';
import { HeaderLComponent } from "../header-l/header-l.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inscription-livreur',
  standalone: true,
  imports: [HeaderLComponent, FooterComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './inscription-livreur.component.html',
  styleUrl: './inscription-livreur.component.css'
})
export class InscriptionLivreurComponent {

}
