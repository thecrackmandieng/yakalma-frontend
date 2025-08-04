import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PartenaireService } from '../../services/partenaire.service';
import { Partenaire } from '../../pages/models/partenaire.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  navItems = [
    { label: 'Home', href: '/client/dashboard' },
    { label: 'Restaurant', href: '/restaurants' },
    { label: 'Partenaires', href: '/partenaire-pub' },
    { label: 'Livreurs', href: '/livreur-pub' },
    { label: 'Contact', href: '/contacts' }
  ];

  isMenuOpen = false;
  searchTerm: string = '';
  allRestaurants: Partenaire[] = [];
  filteredRestaurants: Partenaire[] = [];

  constructor(
    private partenaireService: PartenaireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.partenaireService.getPartenaires().subscribe({
      next: (data) => {
        this.allRestaurants = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des restaurants:', err);
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearchChange(): void {
    const search = this.searchTerm.trim().toLowerCase();
    if (!search) {
      this.filteredRestaurants = [];
      return;
    }

    this.filteredRestaurants = this.allRestaurants.filter(r =>
      r.address?.toLowerCase().includes(search)
    );
  }

  goToRestaurantMenu(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/restaurant', id, 'menu']);
      this.searchTerm = '';
      this.filteredRestaurants = [];
    }
  }

  onMouseEnter(event: Event): void {
    const target = event.target as HTMLElement;
    if (target) {
      target.style.backgroundColor = '#f0f0f0';
    }
  }

  onMouseLeave(event: Event): void {
    const target = event.target as HTMLElement;
    if (target) {
      target.style.backgroundColor = 'transparent';
    }
  }
}
