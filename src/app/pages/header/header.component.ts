import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { PaymentService } from '../../services/payment.service';

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
    FontAwesomeModule,

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

  // Propriétés manquantes
  modalItem: any = null;
  paymentService!: PaymentService;

  constructor(
    private partenaireService: PartenaireService,
    private cartService: CartService,
    private router: Router,
    paymentService: PaymentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.paymentService = paymentService;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.partenaireService.getPartenaires().subscribe({
      next: (data) => {
        this.allRestaurants = data;
      },
      error: () => {
        this.showError('Erreur lors du chargement des restaurants.');
      }
    });

    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
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

  goToRestaurantMenu(id: string | undefined) {
    if (id) {
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

  // Méthodes manquantes
  calculateTotalPrice(): number {
    if (!this.modalItem) return 0;

    let total = this.modalItem.price || 0;

    // Ajouter le prix des suppléments si disponibles
    if (this.modalItem.supplements && Array.isArray(this.modalItem.supplements)) {
      total += this.modalItem.supplements.reduce((sum: number, supplement: any) =>
        sum + (supplement.price || 0), 0);
    }

    return total;
  }

  resetPayButton() {
    // Réinitialiser le bouton de paiement du panier
    const payButton = document.querySelector('button[type="submit"]');
    if (payButton) {
      payButton.textContent = 'Payer maintenant';
      payButton.removeAttribute('disabled');
    }

    // Réinitialiser le bouton de paiement individuel
    const payNowButton = document.querySelector('button[onclick*="payNow"]');
    if (payNowButton) {
      payNowButton.textContent = 'Payer maintenant';
      payNowButton.removeAttribute('disabled');
    }
  }

   payNow() {
    if (!this.modalItem) {
      console.error('Aucun plat sélectionné.');
      alert('Veuillez sélectionner un plat avant de procéder au paiement.');
      return;
    }

    // Validation des informations client
    if (!this.payment.name || !this.payment.contact || !this.payment.address) {
      alert('Veuillez remplir tous les champs du formulaire (nom, contact, adresse).');
      return;
    }

    const totalPrice = this.calculateTotalPrice();

    const paymentPayload = {
      item_name: this.modalItem.name,
      item_price: totalPrice,
      currency: "XOF",
      ref_command: `CMD${Date.now()}`,
      customerName: this.payment.name,
      customerEmail: "moustaphadieng0405@gmail.com" // À remplacer par un email dynamique si disponible
    };

    console.log('Payload paiement:', paymentPayload);

    // Afficher un indicateur de chargement
    const payButton = document.querySelector('button[onclick*="payNow"]');
    if (payButton) {
      payButton.textContent = 'Traitement en cours...';
      payButton.setAttribute('disabled', 'true');
    }

    this.paymentService.initPayment(paymentPayload).subscribe({
      next: (res: any) => {
        console.log('Réponse PayTech:', res);
        if (res.redirect_url) {
          window.location.href = res.redirect_url; // redirection
        } else {
          alert('Erreur : URL de redirection non reçue de PayTech.');
          this.resetPayButton();
        }
      },
      error: (err: any) => {
        console.error('Erreur détaillée paiement:', err);

        // Message d'erreur spécifique selon le type d'erreur
        let errorMessage = err.message || 'Erreur lors de la requête de paiement.';

        if (err.message && err.message.includes('authentification')) {
          errorMessage += '\n\nVeuillez contacter le support technique pour vérifier la configuration PayTech.';
        } else if (err.message && err.message.includes('connexion')) {
          errorMessage += '\n\nVérifiez votre connexion internet et réessayez.';
        }

        alert(errorMessage);
        this.resetPayButton();
      }
    });
  }

  // Méthode de paiement pour le panier
  payCart() {
    if (this.cartCount === 0) {
      this.showInfo('Votre panier est vide.');
      return;
    }

    // Ouvrir le modal de paiement directement avec le formulaire
    this.showOrderModal = true;
    this.showOperatorChoice = false; // Passer directement au formulaire
    this.showPaymentForm = true;
    this.selectedOperator = { name: 'Carte prépayée', image: '/assets/carte.jpg' }; // Définir un opérateur par défaut
    this.successMessage = '';
    this.showCartDropdown = false;
  }

  // Méthode pour traiter le paiement du panier après validation du formulaire
  processCartPayment() {
    // Validation des informations client
    if (!this.payment.name || !this.payment.contact || !this.payment.address) {
      this.showError('Veuillez remplir tous les champs du formulaire (nom, contact, adresse).');
      return;
    }

    const totalPrice = this.getCartTotal();

    const paymentPayload = {
      item_name: `Commande panier - ${this.cartItems.length} articles`,
      item_price: totalPrice,
      currency: "XOF",
      ref_command: `CMD${Date.now()}`,
      customerName: this.payment.name,
      customerEmail: "moustaphadieng0405@gmail.com" // À remplacer par un email dynamique si disponible
    };

    console.log('Payload paiement panier:', paymentPayload);

    // Afficher un indicateur de chargement
    const payButton = document.querySelector('button[type="submit"]');
    if (payButton) {
      payButton.textContent = 'Traitement en cours...';
      payButton.setAttribute('disabled', 'true');
    }

    this.paymentService.initPayment(paymentPayload).subscribe({
      next: (res: any) => {
        console.log('Réponse PayTech panier:', res);
        if (res.redirect_url) {
          window.location.href = res.redirect_url; // redirection
          // Vider le panier après redirection réussie
          this.cartService.clearCart();
        } else {
          this.showError('Erreur : URL de redirection non reçue de PayTech.');
          this.resetPayButton();
        }
      },
      error: (err: any) => {
        console.error('Erreur détaillée paiement panier:', err);

        // Message d'erreur spécifique selon le type d'erreur
        let errorMessage = err.message || 'Erreur lors de la requête de paiement.';

        if (err.message && err.message.includes('authentification')) {
          errorMessage += '\n\nVeuillez contacter le support technique pour vérifier la configuration PayTech.';
        } else if (err.message && err.message.includes('connexion')) {
          errorMessage += '\n\nVérifiez votre connexion internet et réessayez.';
        }

        this.showError(errorMessage);
        this.resetPayButton();
      }
    });
  }


}
