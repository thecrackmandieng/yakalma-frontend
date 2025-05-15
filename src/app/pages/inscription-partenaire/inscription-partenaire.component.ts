import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderPComponent } from "../header-p/header-p.component";

@Component({
  selector: 'app-inscription-partenaire',
  standalone: true,
  templateUrl: './inscription-partenaire.component.html',
  styleUrls: ['./inscription-partenaire.component.css'],
  imports: [FooterComponent, HeaderPComponent]
})
export class InscriptionPartenaireComponent {}
