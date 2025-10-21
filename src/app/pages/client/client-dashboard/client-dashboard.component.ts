import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { HeaderComponent } from "../../header/header.component";
import { ContenuComponent } from "../../contenu/contenu.component";
import { BanniereComponent } from "../../banniere/banniere.component";
import { SectionWrapperComponent } from "../../section-wrapper/section-wrapper.component";
import { SectionComponent } from "../../section/section.component";
import { DivWrapperComponent } from "../../div-wrapper/div-wrapper.component";
import { FooterComponent } from "../../footer/footer.component";
import { SectionRestaurantListComponent } from "../../section-restaurant-list/section-restaurant-list.component";

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    ContenuComponent,
    BanniereComponent,
    SectionWrapperComponent,
    SectionComponent,
    DivWrapperComponent,
    FooterComponent,
    SectionRestaurantListComponent
],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardComponent implements OnInit {

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Ce code ne s’exécutera que dans le navigateur
      console.log('Exécution côté navigateur');
      // Tu peux mettre ici des appels à window, document, etc.
    }
  }
}
