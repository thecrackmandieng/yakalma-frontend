import { Component } from '@angular/core';
import { HeaderRestaurantComponent } from "../../header-restaurant/header-restaurant.component";
import { FooterComponent } from "../../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [HeaderRestaurantComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.css'],
})
export class RestaurantMenuComponent {
  menuItems = [
    {
      name: "Poulet Yassa",
      description: "Poulet mariné aux oignons et citron, servi avec du riz.",
      price: 3500,
      image: "assets/riz.png"
    },
    {
      name: "Thieboudienne",
      description: "Riz au poisson traditionnel sénégalais.",
      price: 4000,
      image: "assets/dieune.webp"
    },
    {
      name: "Pizza Margherita",
      description: "Pizza classique avec sauce tomate, mozzarella et basilic.",
      price: 5000,
      image: "assets/pizzaa.jpg"
    },
    {
      name: "Burger Maison",
      description: "Burger au steak haché, fromage, salade et sauce maison.",
      price: 3000,
      image: "assets/yassa.webp"
    },
    {
      name: "Salade Végétarienne",
      description: "Salade fraîche avec légumes de saison.",
      price: 2500,
      image: "assets/salade.jpeg"
    },
    {
      name: "Poisson Grillé",
      description: "Poisson frais grillé, servi avec légumes.",
      price: 4500,
      image: "assets/griade.webp"
    },
    {
      name: "Croissant",
      description: "Viennoiserie française au beurre.",
      price: 800,
      image: "assets/croissant.jpeg"
    },
    {
      name: "Jus de Bissap",
      description: "Boisson traditionnelle à base de fleurs d’hibiscus.",
      price: 500,
      image: "assets/bissap.webp"
    }
  ];

  operators = [
    { name: 'Wave', image: 'assets/wave.webp' },
    { name: 'Orange Money', image: 'assets/Orange.png' },
    { name: 'Carte prépayée', image: 'assets/carte.jpg' }
  ];

  selectedItem: any = null;
  showModal = false;
  modalItem: any = null;
  quantity = 1;

  // Pour la gestion des étapes
  showOperatorChoice = false;
  showPaymentForm = false;
  selectedOperator: any = null;

  payment = {
    name: '',
    card: '',
    exp: '',
    cvc: ''
  };

  get totalPrice(): number {
    return this.modalItem ? this.modalItem.price * this.quantity : 0;
  }

  selectItem(item: any) {
    this.selectedItem = item;
  }

  openModal(item: any, event: Event) {
    event.stopPropagation();
    this.modalItem = item;
    this.quantity = 1;
    this.showModal = true;
    this.showOperatorChoice = false;
    this.showPaymentForm = false;
    this.selectedOperator = null;
    this.payment = { name: '', card: '', exp: '', cvc: '' };
  }

  closeModal() {
    this.showModal = false;
    this.modalItem = null;
    this.showOperatorChoice = false;
    this.showPaymentForm = false;
    this.selectedOperator = null;
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  placeOrderWithQuantity() {
    this.showOperatorChoice = true;
  }

  chooseOperator(operator: any) {
    this.selectedOperator = operator;
    if (operator.name === 'Wave') {
      // Redirection vers le site Wave
      window.open('https://www.wave.com/sn/', '_blank');
      this.closeModal();
      return;
    }
    this.showOperatorChoice = false;
    this.showPaymentForm = true;
  }

  validatePayment() {
    alert(
      `Paiement validé pour ${this.modalItem.name} (x${this.quantity})\nMontant total: ${this.totalPrice} FCFA\nOpérateur: ${this.selectedOperator?.name}\nNom: ${this.payment.name}\nCarte: ${this.payment.card}`
    );
    this.closeModal();
  }
}
