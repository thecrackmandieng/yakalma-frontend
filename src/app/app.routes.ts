 import { Routes } from '@angular/router';

// Import des composants
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersManagementComponent } from './pages/admin/admin-users-management/admin-users-management.component';
import { AdminRestaurantsManagementComponent } from './pages/admin/admin-restaurants-management/admin-restaurants-management.component';
import { AdminOrdersManagementComponent } from './pages/admin/admin-orders-management/admin-orders-management.component';
import { AdminSettingsComponent } from './pages/admin/admin-settings/admin-settings.component';

import { RestaurantDashboardComponent } from './pages/restaurant/restaurant-dashboard/restaurant-dashboard.component';
import { RestaurantMenuManagementComponent } from './pages/restaurant/restaurant-menu-management/restaurant-menu-management.component';
import { RestaurantOrdersTrackingComponent } from './pages/restaurant/restaurant-orders-tracking/restaurant-orders-tracking.component';
import { RestaurantOrdersHistoryComponent } from './pages/restaurant/restaurant-orders-history/restaurant-orders-history.component';
import { RestaurantSettingsComponent } from './pages/restaurant/restaurant-settings/restaurant-settings.component';
import { RestaurantMenuComponent } from './pages/restaurant/restaurant-menu/restaurant-menu.component';


import { LivreurDashboardComponent } from './pages/livreur/livreur-dashboard/livreur-dashboard.component';
import { LivreurMapComponent } from './pages/livreur/livreur-map/livreur-map.component';
import { LivreurDeliveriesHistoryComponent } from './pages/livreur/livreur-deliveries-history/livreur-deliveries-history.component';
import { LivreurProfileComponent } from './pages/livreur/livreur-profile/livreur-profile.component';

import { ClientDashboardComponent } from './pages/client/client-dashboard/client-dashboard.component';
import { ClientRestaurantsComponent } from './pages/client/client-restaurants/client-restaurants.component';
import { ClientMenuComponent } from './pages/client/client-menu/client-menu.component';
import { ClientOrdersTrackingComponent } from './pages/client/client-orders-tracking/client-orders-tracking.component';
import { ClientOrdersHistoryComponent } from './pages/client/client-orders-history/client-orders-history.component';
import { PartenairePubComponent } from './pages/partenaire-pub/partenaire-pub.component';
import { InscriptionPartenaireComponent } from './pages/inscription-partenaire/inscription-partenaire.component';
import { InscriptionPCompletComponent } from './pages/inscription-p-complet/inscription-p-complet.component';

import { InscriptionLivreurComponent } from './pages/inscription-livreur/inscription-livreur.component';
import { InscriptionLCompletComponent } from './pages/inscription-l-complet/inscription-l-complet.component';
import { ConnexionPartenaireComponent } from './pages/connexion-partenaire/connexion-partenaire.component';
import { ConnexionLivreurComponent } from './pages/connexion-livreur/connexion-livreur.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { RestaurantListeComponent } from './pages/restaurant-liste/restaurant-liste.component';





import { SupportComponent } from './pages/support/support.component';
import { FaqComponent } from './pages/faq/faq.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LivreurPubComponent } from './pages/livreur-pub/livreur-pub.component';

export const routes: Routes = [
  // Authentification
  { path: '', redirectTo: 'client/dashboard', pathMatch: 'full' },  // Redirection vers la page de connexion à l'accueil

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'partenaire-pub', component: PartenairePubComponent },
  { path: 'livreur-pub', component: LivreurPubComponent },



  // Admin
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/users-management', component: AdminUsersManagementComponent },
  { path: 'admin/restaurants-management', component: AdminRestaurantsManagementComponent },
  { path: 'admin/orders-management', component: AdminOrdersManagementComponent },
  { path: 'admin/settings', component: AdminSettingsComponent },

  // Restaurant
  { path: 'restaurant/dashboard', component: RestaurantDashboardComponent },
  { path: 'restaurant/menu-management', component: RestaurantMenuManagementComponent },
  { path: 'restaurant/menu', component: RestaurantMenuComponent },
  { path: 'restaurant/orders-tracking', component: RestaurantOrdersTrackingComponent },
  { path: 'restaurant/orders-history', component: RestaurantOrdersHistoryComponent },
  { path: 'restaurant/settings', component: RestaurantSettingsComponent },
  { path: 'inscription-partenaire', component: InscriptionPartenaireComponent },
  { path: 'inscription-p-complet', component: InscriptionPCompletComponent },
  { path: 'connexion-partenaire', component: ConnexionPartenaireComponent },
  { path: 'restaurants', component: RestaurantListeComponent },



  // Livreur
  { path: 'livreur/dashboard', component: LivreurDashboardComponent },
  { path: 'livreur/map', component: LivreurMapComponent },
  { path: 'livreur/deliveries-history', component: LivreurDeliveriesHistoryComponent },
  { path: 'livreur/profile', component: LivreurProfileComponent },
  { path: 'connexion-livreur', component: ConnexionLivreurComponent },
  { path: 'inscription-livreur', component: InscriptionLivreurComponent },
  { path: 'inscription-l-complet', component: InscriptionLCompletComponent },




  // Client
  { path: 'client/dashboard', component: ClientDashboardComponent },
  { path: 'client/restaurants', component: ClientRestaurantsComponent },
  { path: 'client/menu', component: ClientMenuComponent },
  { path: 'client/orders-tracking', component: ClientOrdersTrackingComponent },
  { path: 'client/orders-history', component: ClientOrdersHistoryComponent },

  // Autres
  { path: 'contacts', component: ContactsComponent },
  { path: 'support', component: SupportComponent },
  { path: 'faq', component: FaqComponent },
  { path: '**', component: NotFoundComponent }, // Page 404
];
