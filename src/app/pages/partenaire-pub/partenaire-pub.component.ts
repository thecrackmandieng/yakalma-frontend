import { Component } from '@angular/core';
import { HeaderPComponent } from "../header-p/header-p.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-partenaire-pub',
  standalone: true,
  imports: [
    HeaderPComponent,
    FooterComponent
],
  templateUrl: './partenaire-pub.component.html',
  styleUrl: './partenaire-pub.component.css'
})
export class PartenairePubComponent {

}
