import { Component } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-banniere',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './banniere.component.html',
  styleUrls: ['./banniere.component.css']
})
export class BanniereComponent {
  constructor(
      private router: Router
    ) {}

  navigationDots = [
    { active: true },
    { active: false },
    { active: false },
  ];
  onRestaurantClick(): void {
    this.router.navigate(['/restaurants']);
  }
}
