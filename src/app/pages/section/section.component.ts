import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent {
  features = [
    {
      id: 1,
      icon: 'fa-solid fa-utensils',
      iconAlt: 'Delivery food order',
      title: 'Commande de nourriture en ligne',
      description: 'Livraison de nourriture facile des meilleurs restaurants.'
    },
    {
      id: 2,
      icon: 'fa-solid fa-apple-alt',
      iconAlt: 'Healthy food',
      title: 'Alimentation 100% saine',
      description: 'Manger une grande variété d\'aliments nutritifs aliments'
    }
  ];
}