import { Component } from '@angular/core';
import { HeaderLComponent } from "../header-l/header-l.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-inscription-livreur',
  standalone: true,
  imports: [HeaderLComponent, FooterComponent],
  templateUrl: './inscription-livreur.component.html',
  styleUrl: './inscription-livreur.component.css'
})
export class InscriptionLivreurComponent {

}
