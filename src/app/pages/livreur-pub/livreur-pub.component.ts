import { Component } from '@angular/core';
import { HeaderLComponent } from "../header-l/header-l.component";
import { FooterComponent } from "../footer/footer.component";


@Component({
  selector: 'app-livreur-pub',
  standalone: true,
  imports: [
    HeaderLComponent,
    FooterComponent
  ],
  templateUrl: './livreur-pub.component.html',
  styleUrl: './livreur-pub.component.css'
})
export class LivreurPubComponent {

}
