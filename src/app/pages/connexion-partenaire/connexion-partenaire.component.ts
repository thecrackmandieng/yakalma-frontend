import { Component } from '@angular/core';
import { HeaderPComponent } from "../header-p/header-p.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-connexion-partenaire',
  standalone: true,
  imports: [HeaderPComponent, FooterComponent],
  templateUrl: './connexion-partenaire.component.html',
  styleUrl: './connexion-partenaire.component.css'
})
export class ConnexionPartenaireComponent {

}
