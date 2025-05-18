import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-header-restaurant',
  standalone: true,
  imports: [ CommonModule, RouterModule],
  templateUrl: './header-restaurant.component.html',
  styleUrl: './header-restaurant.component.css'
})
export class HeaderRestaurantComponent {
   activeLink = 'accueil';

  setActive(link: string) {
    this.activeLink = link;
  }

}
