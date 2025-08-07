import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeaderRestaurantComponent } from "../../header-restaurant/header-restaurant.component";
import { FooterComponent } from "../../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartenaireService } from '../../../services/partenaire.service';
import { MenuItem } from '../../models/menu-item.model';
import { ActivatedRoute, Router } from '@angular/router';

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

  showOperatorChoice = false;
  showPaymentForm = false;
  selectedOperator: any = null;

  payment = {
    name: '',
    card: '',
    exp: '',
    cvc: '',
    address: '',
    contact: ''
  };

  showAddDishModal = false;
  newDish: Partial<MenuItem> = {
    name: '',
    description: '',
    price: 0,
    image: ''
  };

  showEditDishModal = false;
  editDish: Partial<MenuItem> = {};
  editImagePreview: string | ArrayBuffer | null = null;
  selectedEditImage: File | null = null;

  showDeleteConfirmModal = false;
  dishToDelete: MenuItem | null = null;

  operators = [
    { name: 'Wave', image: 'assets/wave.webp' },
    { name: 'Orange Money', image: 'assets/Orange.png' },
    { name: 'Carte prépayée', image: 'assets/carte.jpg' }
  ];

  restaurantName: string = '';
  restaurantId: string = '';
  isRestaurant: boolean = false;

  constructor(
    private partenaireService: PartenaireService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('profile') || '{}');
    this.isRestaurant = user?.role === 'restaurant';

    if (token && this.isRestaurant) {
      // Utilisateur restaurant connecté : afficher son propre nom
      this.restaurantName = user?.name || '';

      const storedId = localStorage.getItem('restaurantId');
      if (storedId) {
        this.restaurantId = storedId;
        this.loadMenuFromRoute();
      } else {
        this.loadRestaurantProfile();
      }

    } else {
      // Pas connecté en restaurant : récupérer id dans l'URL
      this.route.params.subscribe(params => {
        this.restaurantId = params['id'];
        if (this.restaurantId) {
          this.getRestaurantName(this.restaurantId);  // récupère et set le nom du restaurant
          this.loadMenuFromRoute();                   // charge le menu du restaurant
        } else {
          console.error("⚠️ Aucun ID restaurant trouvé dans l'URL.");
        }
      });
    }
  }
}


  getRestaurantName(id: string) {
    this.partenaireService.getPartenaireById(id).subscribe({
      next: (restaurant) => {
        this.restaurantName = restaurant.name;
      },
      error: (err) => console.error('Erreur récupération nom restaurant:', err)
    });
  }

  private loadMenuFromRoute() {
    let id = this.restaurantId;
    if (!id && isPlatformBrowser(this.platformId)) {
      id = localStorage.getItem('restaurantId') || '';
    }

    if (!id) {
      console.error("❌ ID du restaurant introuvable.");
      return;
    }

    this.partenaireService.getMenuByRestaurantId(id).subscribe({
      next: (menus) => {
        this.menuItems = menus;
      },
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

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    return `https://yakalma.onrender.com/${imagePath}`;
  }

  get totalPrice(): number {
    return this.modalItem ? this.modalItem.price * this.quantity : 0;
  }

  openModal(item: MenuItem, event: Event) {
    event.stopPropagation();
    this.modalItem = item;
    this.quantity = 1;
    this.showModal = true;
    this.showOperatorChoice = false;
    this.showPaymentForm = false;
    this.selectedOperator = null;
    this.payment = { name: '', card: '', exp: '', cvc: '', address: '', contact: '' };
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
      window.open('https://www.wave.com/sn/', '_blank');
      this.closeModal();
      return;
    }
    this.showOperatorChoice = false;
    this.showPaymentForm = true;
  }

  validatePayment() {
    if (!this.modalItem || !this.modalItem.name) return;

    const restaurantId = localStorage.getItem('restaurantId');
    if (!restaurantId) {
      this.successMessage = "Erreur : Identifiant du restaurant non trouvé. Veuillez vous reconnecter.";
      setTimeout(() => this.successMessage = '', 3000);
      return;
    }

    const orderPayload = {
      items: [
        {
          name: this.modalItem.name,
          quantity: this.quantity,
          image: this.modalItem.image || ''
        }
      ],
      customerName: this.payment.name.trim(),
      address: this.payment.address.trim(),
      contact: this.payment.contact.trim(),
      restaurantId: restaurantId
    };

    this.partenaireService.createOrder(orderPayload).subscribe({
      next: () => {
        this.successMessage = "✅ Commande envoyée avec succès !";
        setTimeout(() => {
          this.successMessage = '';
          this.closeModal();
        }, 2000);
      },
      error: () => {
        this.successMessage = "Erreur lors de l'envoi de la commande.";
        setTimeout(() => this.successMessage = '', 3000);
      }
    });
  }

  openAddDishModal() {
    this.showAddDishModal = true;
  }

  closeAddDishModal() {
    this.showAddDishModal = false;
    this.newDish = { name: '', description: '', price: 0, image: '' };
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

    this.partenaireService.addMenuItem(formData).subscribe({
      next: (res: any) => {
        this.menuItems.push(res.menuItem);
        this.closeAddDishModal();
      },
      error: () => alert("Erreur lors de l'ajout du plat.")
    });
  }

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

    this.partenaireService.updateMenuItem(this.editDish._id, formData).subscribe({
      next: (res: any) => {
        const index = this.menuItems.findIndex(i => i._id === this.editDish._id);
        if (index !== -1) {
          this.menuItems[index] = res.menuItem;
        }
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
}
