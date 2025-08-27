import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HeaderRestaurantComponent } from "../../header-restaurant/header-restaurant.component";
import { FooterComponent } from "../../footer/footer.component";
import { FormsModule } from '@angular/forms';
import { PartenaireService } from '../../../services/partenaire.service';
import { CartService } from '../../../services/cart.service';
import { MenuItem } from '../../models/menu-item.model';
import { Supplement } from '../../models/supplement.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { environment } from '../../../../environments/environment';

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
  successMessage: string = '';

  showModal = false;
  modalItem: MenuItem | null = null;
  quantity = 1;

  showPaymentForm = false;

  payment = {
    name: '',
    contact: '',
    address: ''
  };

  showAddDishModal = false;
  newDish: any = { name: '', description: '', price: 0, image: '', supplements: [] };
  newSupplements: Supplement[] = [];

  showEditDishModal = false;
  editDish: any = {};
  editSupplements: Supplement[] = [];
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

  openModal(item: MenuItem, event: Event) {
    event.stopPropagation();
    this.modalItem = item;
    this.quantity = 1;
    this.showModal = true;
    this.showPaymentForm = true; // directement afficher le formulaire
    this.payment = { name: '', contact: '', address: '' };

    this.modalSupplements = (item.supplements || []).map((s: any) => ({
      ...s,
      selected: false
    }));
  }

  closeModal() {
    this.showModal = false;
    this.modalItem = null;
    this.showPaymentForm = false;
    this.modalSupplements = [];
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

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

    const selectedSupplements = this.modalSupplements.filter(s => s.selected);
    const itemToAdd = {
      ...this.modalItem,
      quantity: this.quantity,
      supplements: selectedSupplements,
      total: this.calculateTotalPrice()
    };
    this.cartService.addToCart(itemToAdd);
    this.closeModal();
  }

  // --- Paiement direct via PayTech ---//
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
      next: (res) => {
        console.log('Réponse PayTech:', res);
        if (res.redirect_url) {
          window.location.href = res.redirect_url; // redirection
        } else {
          alert('Erreur : URL de redirection non reçue de PayTech.');
          this.resetPayButton();
        }
      },
      error: (err) => {
        console.error('Erreur détaillée paiement:', err);

        // Message d'erreur spécifique selon le type d'erreur
        let errorMessage = err.message || 'Erreur lors de la requête de paiement.';

        if (err.message.includes('authentification')) {
          errorMessage += '\n\nVeuillez contacter le support technique pour vérifier la configuration PayTech.';
        } else if (err.message.includes('connexion')) {
          errorMessage += '\n\nVérifiez votre connexion internet et réessayez.';
        }

        alert(errorMessage);
        this.resetPayButton();
      }
    });
  }

  private resetPayButton() {
    const payButton = document.querySelector('button[onclick*="payNow"]');
    if (payButton) {
      payButton.textContent = 'Payer maintenant';
      payButton.removeAttribute('disabled');
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    // Si l'imagePath est déjà une URL complète (http, https, data:), la retourner directement
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    // Pour les chemins relatifs, construire l'URL complète avec le serveur backend
    return `https://yakalma.onrender.com/${imagePath}`;
  }

  // --- Les méthodes addDish, updateDish, delete, supplements etc restent inchangées ---
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
    if (!this.selectedImage || !this.newDish.name || !this.newDish.description || !this.newDish.price) {
      alert('Tous les champs sont requis.');
      return;
    }
    const formData = new FormData();
    formData.append('name', this.newDish.name);
    formData.append('description', this.newDish.description);
    formData.append('price', this.newDish.price.toString());
    formData.append('image', this.selectedImage);
    if (this.newDish.supplements && this.newDish.supplements.length > 0) {
      formData.append('supplements', JSON.stringify(this.newDish.supplements));
    }
    this.partenaireService.addMenuItem(formData).subscribe({
      next: (res: any) => {
        this.menuItems.push(res.menuItem);
        this.closeAddDishModal();
      },
      error: () => alert('Erreur lors de l\'ajout du plat.')
    });
  }

  // Les méthodes updateDish, deleteDish et gestion suppléments restent identiques

  openEditDishModal(item: MenuItem) {
    this.editDish = { ...item };
    this.editImagePreview = this.getImageUrl(item.image || '');
    this.selectedEditImage = null;
    this.showEditDishModal = true;
  }

  closeEditDishModal() {
    this.showEditDishModal = false;
    this.editDish = {};
    this.editImagePreview = null;
    this.selectedEditImage = null;
  }

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
    if (!this.editDish._id || !this.editDish.name || !this.editDish.description || !this.editDish.price) {
      alert('Tous les champs sont requis.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.editDish.name);
    formData.append('description', this.editDish.description);
    formData.append('price', this.editDish.price.toString());
    if (this.selectedEditImage) {
      formData.append('image', this.selectedEditImage);
    }
    if (this.editDish.supplements && this.editDish.supplements.length > 0) {
      formData.append('supplements', JSON.stringify(this.editDish.supplements));
    }

    this.partenaireService.updateMenuItem(this.editDish._id, formData).subscribe({
      next: (res: any) => {
        const index = this.menuItems.findIndex(i => i._id === this.editDish._id);
        if (index !== -1) this.menuItems[index] = res.menuItem;
        this.closeEditDishModal();
      },
      error: () => alert('Erreur lors de la modification du plat.')
    });
  }

  openDeleteConfirmModal(item: MenuItem) {
    this.dishToDelete = item;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.dishToDelete = null;
  }

  confirmDelete() {
    if (!this.dishToDelete?._id) return;

    this.partenaireService.deleteMenuItem(this.dishToDelete._id).subscribe({
      next: () => {
        this.menuItems = this.menuItems.filter(i => i._id !== this.dishToDelete?._id);
        this.closeDeleteConfirmModal();
      },
      error: () => alert('Erreur lors de la suppression du plat.')
    });
  }

  // Méthodes pour gérer les suppléments
  addNewSupplement() {
    if (!this.newDish.supplements) {
      this.newDish.supplements = [];
    }
    this.newDish.supplements.push({ name: '', price: 0 });
  }

  removeNewSupplement(index: number) {
    if (this.newDish.supplements) {
      this.newDish.supplements.splice(index, 1);
    }
  }

  addEditSupplement() {
    if (!this.editDish.supplements) {
      this.editDish.supplements = [];
    }
    this.editDish.supplements.push({ name: '', price: 0 });
  }

  removeEditSupplement(index: number) {
    if (this.editDish.supplements) {
      this.editDish.supplements.splice(index, 1);
    }
  }
}
