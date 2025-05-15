import { Component } from '@angular/core';
import { HeaderLComponent } from "../header-l/header-l.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-connexion-livreur',
  standalone: true,
  imports: [HeaderLComponent, FooterComponent],
  templateUrl: './connexion-livreur.component.html',
  styleUrl: './connexion-livreur.component.css'
})
export class ConnexionLivreurComponent {

}
