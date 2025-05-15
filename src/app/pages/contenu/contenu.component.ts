import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUtensils, faAppleAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contenu',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './contenu.component.html',
  styleUrls: ['./contenu.component.css']
})
export class ContenuComponent {
  steps = [
    {
      number: '1',
      title: 'Explorer le menu',
      description: 'Une gamme d\'outils puissants pour visualisation,\n' +
                   'interrogation et filtrage vos données.',
      icon: faUtensils
    },
    {
      number: '2',
      title: 'Choisissez un plat',
      description: 'Une gamme d\'outils puissants pour visualisation,\n' +
                   'interrogation et filtrage vos données.',
      icon: faAppleAlt
    },
    {
      number: '3',
      title: 'Passer la commande',
      description: 'Une gamme d\'outils puissants pour visualisation,\n' +
                   'interrogation et filtrage vos données.',
      icon: faShoppingCart
    }
  ];

  constructor(library: FaIconLibrary) {
    library.addIcons(faUtensils, faAppleAlt, faShoppingCart);
  }
}