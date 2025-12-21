import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HeaderRestaurantComponent } from "../../header-restaurant/header-restaurant.component";
import { FooterComponent } from "../../footer/footer.component";
import { FormsModule, NgForm } from '@angular/forms';
import { PartenaireService, Order } from '../../../services/partenaire.service';
import { CartService } from '../../../services/cart.service';
import { MenuItem } from '../../models/menu-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { ToastSuccessComponent } from '../../../components/toast-success/toast-success.component';
import { ToastErrorComponent } from '../../../components/toast-error/toast-error.component';
import { GeolocationService } from '../../../services/geolocation.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [HeaderRestaurantComponent, FooterComponent, CommonModule, FormsModule, ToastSuccessComponent, ToastErrorComponent],
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.css'],
})
export class RestaurantMenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  loading: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedImage: File | null = null;

  showModal = false;
  modalItem: MenuItem | null = null;
  quantity = 1;

  showPaymentForm = false;
payment = { name: '', contact: '', address: '', email: '', latitude: 0, longitude: 0 };
  createAccount = true;

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
  tableId: string = '';

  deliveryFee = 500;
  serviceFee = 300;

  modalSupplements: { name: string, price: number, selected: boolean }[] = [];

  currentPosition: { latitude: number; longitude: number } | null = null;

  isGpsLoading: boolean = false;
  isPaymentLoading: boolean = false;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private partenaireService: PartenaireService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private paymentService: PaymentService,
    private geolocationService: GeolocationService,
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

    this.route.queryParams.subscribe(queryParams => {
      this.tableId = queryParams['table'] || '';
      console.log('Table ID from QR:', this.tableId);
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

    this.loading = true;
    this.partenaireService.getMenuByRestaurantId(id).subscribe({
      next: (menus) => {
        this.menuItems = menus;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération menus:', err);
        this.menuItems = [];
        this.loading = false;
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

    this.payment = {
  name: '',
  contact: '',
  address: '',
  email: '',
  latitude: 0,
  longitude: 0
};
  this.createAccount = true; // ✅ coché par défaut

  this.isGpsLoading = true; // Start GPS loading
  this.getUserLocationAndAddress(); // ✅ GPS auto

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

  // --- GPS Location Detection ---
  private async detectCurrentLocation() {
    try {
      const position = await this.geolocationService.requestClientLocation();
      const address = await this.geolocationService.reverseGeocode(position.latitude, position.longitude);
      this.payment.address = address;
    } catch (error) {
      console.error('Erreur détection GPS:', error);
      // L'adresse reste vide si la géolocalisation échoue
    }
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
    this.successMessage = 'Plat ajouté au panier avec succès !';
    this.closeModal();
  }


 getUserLocationAndAddress() {
  console.log('🔍 Vérification support géolocalisation...');

  if (!navigator.geolocation) {
    console.warn('❌ Géolocalisation non supportée');
    this.isGpsLoading = false;
    this.errorMessage = 'Géolocalisation non supportée. Veuillez saisir votre adresse manuellement.';
    return;
  }

  this.isGpsLoading = true;
  this.errorMessage = ''; // Clear any previous errors
  console.log('📍 Demande position GPS client...');

  // Timeout pour l'ensemble du processus (GPS + géocodage)
  const totalTimeout = setTimeout(() => {
    console.warn('⏰ Timeout global du processus GPS + géocodage');
    this.isGpsLoading = false;
    this.errorMessage = 'Timeout lors de la récupération de la position. Veuillez saisir votre adresse manuellement.';
  }, 25000); // 25 secondes total

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      console.log('✅ GPS client récupéré', { latitude, longitude, accuracy });

      this.payment.latitude = latitude;
      this.payment.longitude = longitude;

      // 🔄 Géocodage inverse pour récupérer l'adresse
      try {
        console.log('🏠 Récupération de l\'adresse via géocodage inverse...');
        const address = await this.geolocationService.reverseGeocode(latitude, longitude);
        this.payment.address = address;
        console.log('✅ Adresse récupérée:', address);

        // Si l'adresse indique un problème, informer l'utilisateur
        if (address.includes('veuillez saisir manuellement')) {
          this.errorMessage = 'Impossible de récupérer l\'adresse automatiquement. Veuillez la saisir manuellement ci-dessous.';
        } else {
          this.successMessage = 'Position et adresse récupérées avec succès !';
        }
      } catch (error) {
        console.warn('⚠️ Échec du géocodage inverse:', error);
        this.payment.address = '';
        this.errorMessage = 'Impossible de récupérer l\'adresse. Veuillez la saisir manuellement ci-dessous.';
      }

      clearTimeout(totalTimeout);
      this.isGpsLoading = false;
    },
    (error) => {
      clearTimeout(totalTimeout);
      console.warn('⚠️ GPS indisponible, mode adresse manuelle activé');
      console.warn(error);

      // GPS échoué → on ne bloque PAS
      this.payment.latitude = 0;
      this.payment.longitude = 0;
      this.payment.address = '';
      this.errorMessage = 'Impossible d\'obtenir votre position GPS. Veuillez saisir votre adresse manuellement.';

      this.isGpsLoading = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000
    }
  );
}





  // --- Paiement ---
  async payNow() {
    console.log('payNow called', this.payment);

    // Prevent multiple clicks
    if (this.isPaymentLoading) {
      console.log('Payment already in progress, ignoring click');
      return;
    }

    if (
      !this.modalItem ||
      !this.payment.name ||
      !this.payment.contact ||
      !this.payment.email
    ) {
      this.errorMessage =
        'Veuillez remplir les informations obligatoires (nom, contact, email).';
      return;
    }

    // Si l'adresse est vide, demander à l'utilisateur de la saisir
    if (!this.payment.address || this.payment.address.trim() === '') {
      this.errorMessage = 'Veuillez saisir votre adresse de livraison.';
      return;
    }

    this.isPaymentLoading = true;
    this.errorMessage = '';

    const totalPrice = this.calculateTotalPrice();
    const ref = `CMD${Date.now()}`;

    try {
      // 1. D'abord, enregistrer la commande dans la base de données
      console.log('📦 Sauvegarde de la commande avant paiement...');
      const orderSaved = await this.saveOrder(totalPrice, ref);

      if (!orderSaved) {
        this.errorMessage = "Impossible d'enregistrer la commande. Veuillez réessayer.";
        return;
      }

      // 2. Ensuite, initier le paiement
      const paymentPayload = {
        item_name: this.modalItem.name,
        item_price: totalPrice,
        currency: 'XOF',
        ref_command: ref,
        customerName: this.payment.name,
        customerEmail: this.payment.email
      };

      this.paymentService.initPayment(paymentPayload).subscribe({
        next: (res) => {
          if (res.redirect_url) {
            localStorage.setItem('pending_ref', ref);
            this.successMessage = 'Commande sauvegardée. Redirection vers le paiement...';
            window.location.href = res.redirect_url;
          } else {
            this.errorMessage = 'URL de paiement invalide.';
          }
        },
        error: (err) => {
          console.error('❌ Erreur paiement:', err);
          this.errorMessage = err.message || 'Erreur lors du paiement. La commande reste sauvegardée.';
        }
      });

    } catch (error) {
      console.error('❌ Erreur lors du processus de paiement:', error);
      this.errorMessage = 'Erreur lors du traitement. Veuillez réessayer.';
    } finally {
      this.isPaymentLoading = false;
    }
  }


  // --- Vérification après retour ---
  verifyAndSaveOrder() {
    const ref = localStorage.getItem('pending_ref');
    if (!ref) return;

    this.paymentService.verifyPayment(ref).subscribe({
      next: (res: { status: string }) => {
        if (res.status === 'success') {
          // La commande est déjà enregistrée, juste naviguer vers succès
          localStorage.removeItem('pending_ref');
          this.router.navigate(['/success']); // ✅ affichage succès uniquement après paiement validé
        } else {
          this.errorMessage = 'Paiement non confirmé.';
          this.router.navigate(['/failed']); // redirection en cas d’échec
        }
      },
      error: (err) => console.error('Erreur vérification paiement:', err)
    });
  }

  private async saveOrder(totalPrice: number, ref?: string): Promise<boolean> {
    if (!this.modalItem) return false;

    const selectedSupplements = this.modalSupplements
      .filter(s => s.selected)
      .map(s => ({ name: s.name, price: s.price }));

    const orderPayload: Order = {
      restaurantId: this.restaurantId,
      items: [{
        name: this.modalItem.name,
        price: this.modalItem.price,
        quantity: this.quantity,
        supplements: selectedSupplements,
        dishId: this.modalItem._id || ''
      }],
      customerName: this.payment.name,
      contact: this.payment.contact,
      address: this.payment.address,
      email: this.payment.email,
      location: {
        latitude: this.payment.latitude,
        longitude: this.payment.longitude
      },
      total: totalPrice,
      ref_command: ref,
      tableId: this.tableId
    };

    console.log('📦 Payload commande final:', orderPayload);

    return new Promise<boolean>((resolve, reject) => {
      console.log('🚀 Début création commande avec payload:', orderPayload);

      this.partenaireService.createOrder(orderPayload).subscribe({
        next: async (res) => {
          console.log('✅ Commande créée avec succès:', res);

          // Si l'utilisateur a demandé la création d'un compte, procéder à la création
          if (this.createAccount && this.payment.email) {
            console.log('👤 Création du compte client demandée...');
            const clientData = {
              fullName: this.payment.name,
              email: this.payment.email,
              phone: this.payment.contact,
              address: this.payment.address
            };

            console.log('📧 Données client pour création de compte:', clientData);
            console.log('📧 CreateAccount flag:', this.createAccount);
            console.log('📧 Email fourni:', this.payment.email);

            this.partenaireService.createClientAccount(clientData).subscribe({
              next: (accountRes) => {
                console.log('✅ Compte client créé avec succès:', accountRes);

                // Vérifier la réponse pour voir si l'email a été envoyé
                if (accountRes && typeof accountRes === 'object') {
                  if (accountRes.passwordSentToEmail) {
                    console.log('✅ Email envoyé avec succès !');
                    this.successMessage = 'Commande sauvegardée ! Un compte client a été créé et les identifiants ont été envoyés par email.';
                  } else if (accountRes.emailSent === false) {
                    console.warn('⚠️ Compte créé mais email non envoyé');
                    this.successMessage = 'Commande sauvegardée ! Compte client créé mais problème d\'envoi d\'email.';
                  } else {
                    console.log('ℹ️ Réponse de création de compte:', accountRes);
                    this.successMessage = 'Commande sauvegardée ! Compte client créé.';
                  }
                } else {
                  this.successMessage = 'Commande sauvegardée ! Compte client créé.';
                }

                resolve(true);
              },
              error: (accountErr) => {
                console.error('❌ Erreur détaillée lors de la création de compte:');
                console.error('Status:', accountErr.status);
                console.error('Message:', accountErr.message);
                console.error('Error:', accountErr.error);

                // Afficher plus de détails sur l'erreur
                if (accountErr.error && typeof accountErr.error === 'object') {
                  console.error('📋 Détails erreur backend:', JSON.stringify(accountErr.error, null, 2));
                }

                this.successMessage = 'Commande sauvegardée ! Note: Un problème est survenu lors de la création du compte.';
                resolve(true);
              }
            });
          } else {
            console.log('ℹ️ Création de compte non demandée');
            this.successMessage = 'Commande sauvegardée avec succès !';
            resolve(true);
          }
        },
        error: (err) => {
          console.error('❌ Erreur détaillée lors de la création de commande:');
          console.error('Status:', err.status);
          console.error('Status Text:', err.statusText);
          console.error('Message:', err.message);
          console.error('Error object:', err.error);
          console.error('Full error:', err);

          // Afficher plus de détails sur l'erreur
          if (err.error && typeof err.error === 'object') {
            console.error('📋 Backend validation error details:', JSON.stringify(err.error, null, 2));
          }

          // Extraire le message d'erreur spécifique du backend
          let backendErrorMessage = 'Erreur inconnue';
          if (err.error && typeof err.error === 'object' && err.error.message) {
            backendErrorMessage = err.error.message;
          } else if (err.message) {
            backendErrorMessage = err.message;
          }

          console.error('🚨 Backend Error Message:', backendErrorMessage);

          this.errorMessage = `Impossible d'enregistrer la commande. ${backendErrorMessage}`;
          resolve(false);
        }
      });
    });
  }


  getImageUrl(imagePath?: string): string {
    if (!imagePath) return 'assets/default-dish.png';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    return `${environment.apiUrl}/${imagePath}`;
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
      next: res => { this.menuItems.push(res.menuItem); this.closeAddDishModal(); this.successMessage = 'Plat ajouté !'; },
      error: err => { console.error(err); this.errorMessage = 'Erreur ajout plat'; }
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
        this.successMessage = 'Plat mis à jour !';
      },
      error: err => { console.error(err); this.errorMessage = 'Erreur mise à jour'; }
    });
  }

  openDeleteConfirmModal(dish: MenuItem) { this.dishToDelete = dish; this.showDeleteConfirmModal = true; }
  closeDeleteConfirmModal() { this.dishToDelete = null; this.showDeleteConfirmModal = false; }

  confirmDelete() {
    if (!this.dishToDelete?._id) return;
    this.partenaireService.deleteMenuItem(this.dishToDelete._id).subscribe({
      next: () => { this.menuItems = this.menuItems.filter(m => m._id !== this.dishToDelete?._id); this.closeDeleteConfirmModal(); this.successMessage = 'Plat supprimé !'; },
      error: err => { console.error(err); this.errorMessage = 'Erreur suppression'; }
    });
  }

  addNewSupplement() { this.newDish.supplements.push({ name: '', price: 0 }); }
  removeNewSupplement(i: number) { this.newDish.supplements.splice(i, 1); }
  addEditSupplement() { this.editDish.supplements.push({ name: '', price: 0 }); }
  removeEditSupplement(i: number) { this.editDish.supplements.splice(i, 1); }
}

