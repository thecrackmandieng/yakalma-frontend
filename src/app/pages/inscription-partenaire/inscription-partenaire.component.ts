import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderPComponent } from "../header-p/header-p.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inscription-partenaire',
  standalone: true,
  templateUrl: './inscription-partenaire.component.html',
  styleUrls: ['./inscription-partenaire.component.css'],
  imports: [FooterComponent, HeaderPComponent, CommonModule, FormsModule, RouterModule,],
})
export class InscriptionPartenaireComponent {}
