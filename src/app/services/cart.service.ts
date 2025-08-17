import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: any[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  private cartItemsSubject = new BehaviorSubject<any[]>([]);

  cartCount$ = this.cartCount.asObservable();
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {}

  // ✅ Ajouter au panier
  addToCart(item: any) {
    const existingItem = this.cartItems.find(i => i._id === item._id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ ...item, quantity: 1 });
    }

    this.updateCart();
  }

  // ✅ Supprimer un élément spécifique
  removeFromCart(itemId: string) {
    this.cartItems = this.cartItems.filter(i => i._id !== itemId);
    this.updateCart();
  }

  // ✅ Vider tout le panier
  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  // ✅ Obtenir les articles
  getCartItems() {
    return [...this.cartItems];
  }

  // ✅ Obtenir le compteur actuel
  getCartCount() {
    return this.cartCount.value;
  }

  // ✅ Obtenir le montant total
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // 🔁 Mise à jour des observables internes
  private updateCart() {
    this.cartItemsSubject.next([...this.cartItems]);
    const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.next(totalItems);
  }
}
