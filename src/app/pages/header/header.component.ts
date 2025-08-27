import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { PartenaireService } from '../../services/partenaire.service';
import { Partenaire } from '../../pages/models/partenaire.model';
import { CartService } from '../../services/cart.service';

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
  // Navigation
  navItems = [
    { label: 'Home', href: '/client/dashboard' },
    { label: 'Restaurant', href: '/restaurants' },
    { label: 'Partenaires', href: '/partenaire-pub' },
    { label: 'Livreurs', href: '/livreur-pub' },
    { label: 'Contact', href: '/contacts' }
  ];
  isMenuOpen = false;

  // Recherche
  searchTerm: string = '';
  allRestaurants: Partenaire[] = [];
  filteredRestaurants: Partenaire[] = [];

  // Panier
  cartCount: number = 0;
  cartItems: any[] = [];
  showCartDropdown = false;

  // FontAwesome
  faBars = faBars;
  faTimes = faTimes;

  isBrowser: boolean;
  faShoppingCart = faShoppingCart;

  // Modal commande multi-étapes
  showOrderModal = false;
  showOperatorChoice = true;
  showPaymentForm = false;

  operators = [
    { name: 'Wave', image: '/assets/wave.webp' },
    { name: 'Orange Money', image: '/assets/Orange.png' },
    { name: 'Carte prépayée', image: '/assets/carte.jpg' }
  ];

  selectedOperator: any = null;

  payment = {
    address: '',
    contact: '',
    name: '',
    card: '',
    exp: '',
    cvc: ''
  };

  successMessage = '';
  errorMessage = '';
  infoMessage = '';
  cartService: any;

  constructor(
    private partenaireService: PartenaireService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.partenaireService.getPartenaires().subscribe({
        next: (data) => {
          this.allRestaurants = data;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des restaurants:', err);
        }
      });
    }
  }

  // 🔹 Méthodes messages
  private showSuccess(msg: string) {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 3000);
  }

  private showError(msg: string) {
    this.errorMessage = msg;
    setTimeout(() => this.errorMessage = '', 3000);
  }

  private showInfo(msg: string) {
    this.infoMessage = msg;
    setTimeout(() => this.infoMessage = '', 3000);
  }

  // Menu
  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu() { this.isMenuOpen = false; }
  navigateAndClose(href: string) {
    this.router.navigate([href]).then(() => this.closeMenu());
  }

  // Login
  onLoginClick() {
    this.router.navigate(['/login']);
    this.closeMenu();
  }

  // Recherche
  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredRestaurants = [];
      return;
    }
    this.filteredRestaurants = this.allRestaurants.filter(r =>
      (r.address?.toLowerCase().includes(term) || r.name?.toLowerCase().includes(term))
    );
  }

 
 goToRestaurantMenu(id: string | undefined): void {
    if (id && this.isBrowser) {
      this.router.navigate(['/restaurant', id, 'menu']);
      this.searchTerm = '';
      this.filteredRestaurants = [];
    }
  }

  // Panier
  toggleCartDropdown() { this.showCartDropdown = !this.showCartDropdown; }
  goToCart() {
    this.router.navigate(['/panier']);
    this.showCartDropdown = false;
  }

  emptyCart() {
    if (this.cartCount === 0) {
      this.showInfo('Le panier est déjà vide.');
      return;
    }
    this.cartService.clearCart();
    this.showSuccess('Panier vidé avec succès.');
  }

  // Commander
  openOrderModal() {
    if (this.cartCount === 0) {
      this.showInfo('Votre panier est vide.');
      return;
    }
    this.showOrderModal = true;
    this.showOperatorChoice = true;
    this.showPaymentForm = false;
    this.selectedOperator = null;
    this.successMessage = '';
    this.showCartDropdown = false;
  }

  closeOrderModal() {
    this.showOrderModal = false;
    this.showOperatorChoice = true;
    this.showPaymentForm = false;
    this.selectedOperator = null;
    this.successMessage = '';
  }

  chooseOperator(op: any) {
    this.selectedOperator = op;
    if (op.name === 'Wave') {
      window.open('https://www.wave.com/sn/', '_blank');
      this.closeOrderModal();
      return;
    }
    this.showOperatorChoice = false;
    this.showPaymentForm = true;
  }

  validatePayment() {
  if (
    !this.payment.address ||
    !this.payment.contact ||
    !this.payment.name ||
    !this.payment.card ||
    !this.payment.exp ||
    !this.payment.cvc
  ) {
    this.showError('Veuillez remplir tous les champs.');
    return;
  }

  const restaurantId = this.cartItems.length > 0 ? this.cartItems[0].restaurantId || '' : '';
  if (!restaurantId) {
    this.showError('Erreur : restaurant introuvable.');
    return;
  }

  const orderPayload = {
    items: this.cartItems.map(item => ({
      menuItemId: item._id || item.menuItemId, // <-- Ajoute l'id du plat ici
      name: item.name,
      quantity: item.quantity,
      image: item.image || '',
      price: item.price,
      supplements: item.supplements || []
    })),
    customerName: this.payment.name.trim(),
    address: this.payment.address.trim(),
    contact: this.payment.contact.trim(),
    restaurantId: restaurantId,
    operator: this.selectedOperator?.name || ''
  };

  this.partenaireService.createOrder(orderPayload).subscribe({
    next: () => {
      this.showSuccess('Commande envoyée avec succès !');
      this.cartService.clearCart();
      this.payment = { address: '', contact: '', name: '', card: '', exp: '', cvc: '' };
      setTimeout(() => this.closeOrderModal(), 2000);
    },
    error: () => {
      this.showError('Erreur lors de l\'envoi de la commande.');
    }
  });
}
getCartTotal(): number {
  return this.cartItems.reduce((total, item) => {
    if (item.total) return total + item.total;
    let supplementsTotal = 0;
    if (item.supplements && Array.isArray(item.supplements)) {
      supplementsTotal = item.supplements.reduce((s: number, sup: { price?: number }) => s + (sup.price || 0), 0) * (item.quantity || 1);
    }
    return total + ((item.price * item.quantity) + supplementsTotal);
  }, 0);
}
  cancelOrder() { this.closeOrderModal(); }

  onMouseEnter(event: Event) {
    const el = event.target as HTMLElement;
    if (el) el.style.backgroundColor = '#f0f0f0';
  }

  onMouseLeave(event: Event) {
    const el = event.target as HTMLElement;
    if (el) el.style.backgroundColor = 'transparent';
  }

  clearCart() { this.cartService.clearCart(); }
  getTotalPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}

