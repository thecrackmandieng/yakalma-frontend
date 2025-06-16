import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LivreursService } from '../../../pages/services/livreurs.service';
import { Livreur } from '../../models/livreur.model';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-livreurs',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './livreurs.component.html',
  styleUrls: ['./livreurs.component.css']
})
export class LivreursComponent implements OnInit {
  livreurs: Livreur[] = [];
  isAddModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  isDeleteModalVisible: boolean = false;
  newLivreur: Livreur = { id: 0, nom: '', prenom: '' };
  selectedLivreur: Livreur = { id: 0, nom: '', prenom: '' };
  selectedLivreurId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitted: boolean = false;
  isEditSubmitted: boolean = false;

  constructor(private livreursService: LivreursService) {}

  ngOnInit(): void {
    this.livreursService.getLivreurs().subscribe(livreurs => {
      this.livreurs = livreurs;
    });
  }

  openAddLivreurModal() {
    this.isAddModalVisible = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitted = false;
  }

  closeAddModal() {
    this.isAddModalVisible = false;
  }
onAddSubmit() {
  this.isSubmitted = true;

  if (!this.newLivreur.nom || !this.newLivreur.prenom) {
    this.errorMessage = 'Le nom et le prénom sont requis.';
    return;
  }

  this.livreursService.addLivreur(this.newLivreur).subscribe({
    next: (addedLivreur) => {
      this.livreurs = [...this.livreurs, addedLivreur]; // Utilisation de l'opérateur spread pour éviter les mutations directes
      this.newLivreur = { id: 0, nom: '', prenom: '' };
      this.successMessage = 'Livreur ajouté avec succès!';
      this.errorMessage = '';
      setTimeout(() => {
        this.successMessage = '';
        this.closeAddModal();
      }, 1000);
    },
    error: (error) => {
      console.error('Erreur lors de l\'ajout du livreur:', error);
      this.errorMessage = 'Erreur lors de l\'ajout du livreur. Veuillez réessayer.';
      this.successMessage = '';
    }
  });
}


  openEditLivreurModal(livreur: Livreur) {
    this.selectedLivreur = { ...livreur };
    this.isEditModalVisible = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.isEditSubmitted = false;
  }

  closeEditModal() {
    this.isEditModalVisible = false;
  }

  onEditSubmit() {
    this.isEditSubmitted = true;
    if (!this.selectedLivreur.nom || !this.selectedLivreur.prenom) {
      this.errorMessage = 'Le nom et le prénom sont requis.';
      return;
    }

    this.livreursService.updateLivreur(this.selectedLivreur).subscribe({
      next: (updatedLivreur) => {
        const index = this.livreurs.findIndex(l => l.id === updatedLivreur.id);
        if (index !== -1) {
          this.livreurs[index] = updatedLivreur;
        }
        this.successMessage = 'Livreur mis à jour avec succès!';
        this.errorMessage = '';
        setTimeout(() => this.closeEditModal(), 1000);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour du livreur. Veuillez réessayer.';
        this.successMessage = '';
      }
    });
  }

  openDeleteModal(id: number) {
    this.selectedLivreurId = id;
    this.isDeleteModalVisible = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelDelete() {
    this.isDeleteModalVisible = false;
    this.selectedLivreurId = null;
  }

  confirmDelete() {
    if (this.selectedLivreurId !== null) {
      this.livreursService.deleteLivreur(this.selectedLivreurId).subscribe({
        next: () => {
          this.livreurs = this.livreurs.filter(livreur => livreur.id !== this.selectedLivreurId);
          this.successMessage = 'Livreur supprimé avec succès!';
          setTimeout(() => {
            this.isDeleteModalVisible = false;
            this.successMessage = '';
          }, 1000);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression du livreur. Veuillez réessayer.';
          this.successMessage = '';
        }
      });
    }
  }
}
