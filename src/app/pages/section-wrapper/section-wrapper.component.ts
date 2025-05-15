import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-wrapper.component.html',
  styleUrls: ['./section-wrapper.component.css']
})
export class SectionWrapperComponent {
  categoryCards = [

    {
      id: 1,
      title: "Alimentation biologique",
      dishCount: "12 plats au menu",
      imagePath: "/assets/bio.jpg",
    },
    {
      id: 2,
      title: "Thièbe",
      dishCount: "04 Plats au Menu",
      imagePath: "/assets/riz.png",
    },
    {
      id: 3,
      title: "Grillades",
      dishCount: "12 plats au menu",
      imagePath: "/assets/griade.webp",
    },
    {
      id: 4,
      title: "Poisson",
      dishCount: "12 plats au menu",
      imagePath: "/assets/poisson.jpg",
    },
  ];
}
