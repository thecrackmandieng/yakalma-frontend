import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HeaderRestaurantComponent } from "../../header-restaurant/header-restaurant.component";
import { FooterComponent } from "../../footer/footer.component";
import { FormsModule } from '@angular/forms';
import { PartenaireService, Order } from '../../../services/partenaire.service';
import { CartService } from '../../../services/cart.service';
import { MenuItem } from '../../models/menu-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';


@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [HeaderRestaurantComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.css'],
})
export class RestaurantMenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  selectedImage: File | null = null;

  showModal = false;
  modalItem: MenuItem | null = null;
  quantity = 1;

  showPaymentForm = false;
  payment = { name: '', contact: '', address: '', email: '' };
  createAccount = false;

  showAddDishModal = false;
  newDish: any = { name: '', description: '', price: 0, image: '', supplements: [] };

  showEditDishModal = false;
  editDish: any = {};
  editImagePreview: string | ArrayBuffer | null = null;
  selectedEditImage: File | null = null;

  showDeleteConfirmModal = false;
  dishToDelete: MenuItem | null = null;

  restaurantName: string = '';
  restaurantId: string = '';
  isRestaurant: boolean = false;

  deliveryFee = 500;
  serviceFee = 300;

  modalSupplements: { name: string, price: number, selected: boolean }[] = [];

  constructor(
    private partenaireService: PartenaireService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private paymentService: PaymentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('profile') || '{}');
    this.isRestaurant = user?.role === 'restaurant';

    if (token && this.isRestaurant) {
      this.initAsRestaurant(user);
    } else {
      this.initAsVisitor();
    }
  }

  private initAsRestaurant(user: any) {
    this.restaurantName = user?.name || '';
    const storedId = localStorage.getItem('restaurantId');
    if (storedId) {
      this.restaurantId = storedId;
      this.loadMenuFromRoute();
    } else {
      this.loadRestaurantProfile();
    }
  }

  private initAsVisitor() {
    this.route.params.subscribe(params => {
      this.restaurantId = params['id'];
      if (this.restaurantId) {
        this.getRestaurantName(this.restaurantId);
        this.loadMenuFromRoute();
      } else {
        console.error('Aucun ID restaurant trouvé dans l\'URL.');
      }
    });
  }

  getRestaurantName(id: string) {
    this.partenaireService.getPartenaireById(id).subscribe({
      next: (restaurant) => this.restaurantName = restaurant.name,
      error: (err) => console.error('Erreur récupération nom restaurant:', err)
    });
  }

  private loadMenuFromRoute() {
    const id = this.restaurantId || localStorage.getItem('restaurantId') || '';
    if (!id) return console.error('ID du restaurant introuvable.');

    this.partenaireService.getMenuByRestaurantId(id).subscribe({
      next: (menus) => this.menuItems = menus,
      error: (err) => {
        console.error('Erreur récupération menus:', err);
        this.menuItems = [];
      }
    });
  }

  loadRestaurantProfile() {
    this.partenaireService.getRestaurantProfile().subscribe({
      next: (res: any) => {
        if (res?.restaurant?._id) {
          localStorage.setItem('restaurantId', res.restaurant._id);
          this.restaurantId = res.restaurant._id;
          this.loadMenuFromRoute();
        }
      },
      error: (err) => console.error('Erreur récupération profil restaurant:', err)
    });
  }

  // --- Modal commande ---
  openModal(item: MenuItem, event: Event) {
    event.stopPropagation();
    this.modalItem = item;
    this.quantity = 1;
    this.showModal = true;
    this.showPaymentForm = true;
    this.payment = { name: '', contact: '', address: '', email: '' };
    this.createAccount = false;

    this.modalSupplements = (item.supplements || []).map((s: any) => ({
      name: s.name,
      price: s.price,
      selected: false
    }));
  }

  closeModal() {
    this.showModal = false;
    this.modalItem = null;
    this.showPaymentForm = false;
    this.modalSupplements = [];
  }

  incrementQuantity() { this.quantity++; }
  decrementQuantity() { if (this.quantity > 1) this.quantity--; }

  calculateTotalPrice(): number {
    if (!this.modalItem) return 0;
    const basePrice = this.modalItem.price * this.quantity;
    const supplementsTotal = this.modalSupplements
      .filter(s => s.selected)
      .reduce((sum, s) => sum + (s.price * this.quantity), 0);

    return basePrice + supplementsTotal + this.deliveryFee + this.serviceFee;
  }

  addToCart() {
    if (!this.modalItem) return;
    const selectedSupplements = this.modalSupplements
      .filter(s => s.selected)
      .map(s => ({ name: s.name, price: s.price }));

    const itemToAdd = {
      ...this.modalItem,
      quantity: this.quantity,
      supplements: selectedSupplements,
      total: this.calculateTotalPrice()
    };

    this.cartService.addToCart(itemToAdd);
    this.closeModal();
  }

  // --- Paiement ---
  payNow() {
    if (!this.modalItem || !this.payment.name || !this.payment.contact || !this.payment.address || !this.payment.email) {
      alert('Veuillez remplir tous les champs et sélectionner un plat.');
      return;
    }

    const totalPrice = this.calculateTotalPrice();
    const ref = `CMD${Date.now()}`;
    const paymentPayload = {
      item_name: this.modalItem.name,
      item_price: totalPrice,
      currency: "XOF",
      ref_command: ref,
      customerName: this.payment.name,
      customerEmail: "moustaphadieng0405@gmail.com"
    };

    this.paymentService.initPayment(paymentPayload).subscribe({
      next: (res) => {
        if (res.redirect_url) {
          // ✅ redirection uniquement, pas de saveOrder ici
          localStorage.setItem('pending_ref', ref);
          window.location.href = res.redirect_url;
        } else {
          alert('Erreur : URL de redirection non reçue.');
        }
      },
      error: (err) => alert(err.message || 'Erreur paiement.')
    });
  }

  // --- Vérification après retour ---
  verifyAndSaveOrder() {
    const ref = localStorage.getItem('pending_ref');
    if (!ref) return;

    this.paymentService.verifyPayment(ref).subscribe({
      next: (res: { status: string }) => {
        if (res.status === 'success') {
          const totalPrice = this.calculateTotalPrice();
          this.saveOrder(totalPrice);
          localStorage.removeItem('pending_ref');
          this.router.navigate(['/success']); // ✅ affichage succès uniquement après paiement validé
        } else {
          alert('Paiement non confirmé.');
          this.router.navigate(['/failed']); // redirection en cas d’échec
        }
      },
      error: (err) => console.error('Erreur vérification paiement:', err)
    });
  }

  private async saveOrder(totalPrice: number) {
    if (!this.modalItem) return;

    let clientId: string | null = null;

    // Créer un compte client si demandé
    if (this.createAccount) {
      try {
        const clientResponse = await this.partenaireService.registerClient({
          fullName: this.payment.name,
          email: this.payment.email,
          phone: this.payment.contact,
          address: this.payment.address
        }).toPromise();
        clientId = clientResponse.client?._id || clientResponse._id;
        console.log('Client créé:', clientId);
      } catch (err) {
        console.error('Erreur création client:', err);
        alert("Erreur lors de la création du compte client. La commande sera enregistrée sans compte.");
      }
    }

    const selectedSupplements = this.modalSupplements
      .filter(s => s.selected)
      .map(s => ({ name: s.name, price: s.price }));

    const orderPayload: any = {
      restaurantId: this.restaurantId,
      items: [{
        dishId: this.modalItem._id!,
        name: this.modalItem.name,
        quantity: this.quantity,
        image: this.modalItem.image,
        price: this.modalItem.price,
        supplements: selectedSupplements
      }],
      customerName: this.payment.name,
      address: this.payment.address,
      contact: this.payment.contact,
      total: totalPrice,
      status: 'en_attente',
      clientId: clientId
    };

    this.partenaireService.createOrder(orderPayload).subscribe({
      next: (response) => {
        console.log('Commande enregistrée:', response);
        if (this.createAccount && clientId) {
          alert("Commande enregistrée et compte client créé. Vérifiez votre email pour le mot de passe temporaire.");
        }
      },
      error: (err) => {
        console.error('Erreur enregistrement commande:', err);
        alert("Impossible d'enregistrer la commande.");
      }
    });
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) return 'assets/default-dish.png';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    return `https://yakalma.onrender.com/${imagePath}`;
  }

  // --- Gestion plats ---
  openAddDishModal() { this.showAddDishModal = true; }
  closeAddDishModal() {
    this.showAddDishModal = false;
    this.newDish = { name: '', description: '', price: 0, image: '', supplements: [] };
    this.imagePreview = null;
    this.selectedImage = null;
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  addDish() {
    if (!this.newDish.name || this.newDish.price <= 0) { alert('Remplir nom et prix'); return; }
    const formData = new FormData();
    formData.append('name', this.newDish.name);
    formData.append('description', this.newDish.description);
    formData.append('price', this.newDish.price.toString());
    if (this.selectedImage) formData.append('image', this.selectedImage);
    if (this.newDish.supplements?.length) formData.append('supplements', JSON.stringify(this.newDish.supplements));

    this.partenaireService.addMenuItem(formData).subscribe({
      next: res => { this.menuItems.push(res.menuItem); this.closeAddDishModal(); alert('Plat ajouté !'); },
      error: err => { console.error(err); alert('Erreur ajout plat'); }
    });
  }

  openEditDishModal(dish: MenuItem) {
    this.editDish = { ...dish };
    this.showEditDishModal = true;
    this.editImagePreview = this.getImageUrl(dish.image || '');
    this.selectedEditImage = null;
  }

  closeEditDishModal() { this.showEditDishModal = false; this.editDish = {}; this.editImagePreview = null; this.selectedEditImage = null; }

  onEditImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedEditImage = file;
      const reader = new FileReader();
      reader.onload = () => this.editImagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  updateDish() {
    if (!this.editDish._id) return;
    const formData = new FormData();
    formData.append('name', this.editDish.name);
    formData.append('description', this.editDish.description);
    formData.append('price', this.editDish.price.toString());
    if (this.selectedEditImage) formData.append('image', this.selectedEditImage);
    if (this.editDish.supplements?.length) formData.append('supplements', JSON.stringify(this.editDish.supplements));

    this.partenaireService.updateMenuItem(this.editDish._id, formData).subscribe({
      next: updated => {
        const index = this.menuItems.findIndex(m => m._id === updated._id);
        if (index !== -1) this.menuItems[index] = updated;
        this.closeEditDishModal();
        alert('Plat mis à jour !');
      },
      error: err => { console.error(err); alert('Erreur mise à jour'); }
    });
  }

  openDeleteConfirmModal(dish: MenuItem) { this.dishToDelete = dish; this.showDeleteConfirmModal = true; }
  closeDeleteConfirmModal() { this.dishToDelete = null; this.showDeleteConfirmModal = false; }

  confirmDelete() {
    if (!this.dishToDelete?._id) return;
    this.partenaireService.deleteMenuItem(this.dishToDelete._id).subscribe({
      next: () => { this.menuItems = this.menuItems.filter(m => m._id !== this.dishToDelete?._id); this.closeDeleteConfirmModal(); alert('Plat supprimé !'); },
      error: err => { console.error(err); alert('Erreur suppression'); }
    });
  }

  addNewSupplement() { this.newDish.supplements.push({ name: '', price: 0 }); }
  removeNewSupplement(i: number) { this.newDish.supplements.splice(i, 1); }
  addEditSupplement() { this.editDish.supplements.push({ name: '', price: 0 }); }
  removeEditSupplement(i: number) { this.editDish.supplements.splice(i, 1); }
}
