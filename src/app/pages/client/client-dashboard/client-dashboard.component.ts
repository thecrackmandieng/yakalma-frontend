import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { ContenuComponent } from "../../contenu/contenu.component";
import { BanniereComponent } from "../../banniere/banniere.component";
import { SectionWrapperComponent } from "../../section-wrapper/section-wrapper.component";
import { SectionComponent } from "../../section/section.component";
import { DivWrapperComponent } from "../../div-wrapper/div-wrapper.component";
import { FooterComponent } from "../../footer/footer.component";


@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [HeaderComponent, ContenuComponent, BanniereComponent, SectionWrapperComponent, SectionComponent, DivWrapperComponent, FooterComponent],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardComponent {

}
