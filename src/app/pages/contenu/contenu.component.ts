import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUtensils, faAppleAlt, faShoppingCart, faTruck } from '@fortawesome/free-solid-svg-icons';

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
    description: 'Découvrez une gamme d\'outils puissants pour la <strong>visualisation</strong>, ' +
                 'l\'<strong>interrogation</strong> intelligente et le <strong>filtrage</strong> rapide de vos données culinaires.',
    icon: faUtensils
  },
  {
    number: '2',
    title: 'Commander en ligne',
    description: 'Accédez à une plateforme de <strong>commande en ligne</strong> rapide,<br/>' +
                 'intuitive et optimisée pour tous vos appareils et disponible 24h/24.',
    icon: faShoppingCart
  },
  {
    number: '3',
    title: 'Suivi en temps réel',
    description: 'Bénéficiez d\'un <strong>suivi de livraison en temps réel</strong><br/>' +
                 'avec des mises à jour automatiques,pour une expérience client<br/>transparente et fiable.',
    icon: faTruck
  },
  ];

  constructor(library: FaIconLibrary) {
    library.addIcons(faUtensils, faAppleAlt, faShoppingCart);
  }
}
