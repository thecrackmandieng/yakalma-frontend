import { Component } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banniere',
  standalone: true,
  imports: [
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './banniere.component.html',
  styleUrls: ['./banniere.component.css']
})
export class BanniereComponent {
  navigationDots = [
    { active: true },
    { active: false },
    { active: false },
  ];
}
