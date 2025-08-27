import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartenaireService } from '../../../services/partenaire.service';
import { Partenaire } from '../../models/partenaire.model';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-partenaires',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './partenaires.component.html',
  styleUrls: ['./partenaires.component.css']
})
export class PartenairesComponent implements OnInit, OnDestroy {
  partenaires: Partenaire[] = [];
  newPartenaire: Partial<Partenaire> = { name: '', email: '', phone: '', status: 'pending' };
  selectedPartenaire: Partial<Partenaire> = {};
  selectedPartenaireId: string | null = null;

  isAddModalVisible = false;
  isEditModalVisible = false;
  isDeleteModalVisible = false;
  editFiles: { [key: string]: File } = {};

  isSubmitted = false;
  isEditSubmitted = false;

  errorMessage = '';
  successMessage = '';

  constructor(private partenaireService: PartenaireService) {}

  ngOnInit(): void {
    this.loadPartenaires();
  }

  ngOnDestroy(): void {
    // Libérer les URLs temporaires créées pour l’aperçu
    for (const key in this.editFiles) {
      const previewUrl = this.getPreviewUrl(key);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  }

  loadPartenaires(): void {
    this.partenaireService.getPartenaires().subscribe({
      next: (data) => this.partenaires = data,
      error: () => this.errorMessage = 'Erreur de chargement des partenaires.'
    });
  }

  openAddModal(): void {
    this.isAddModalVisible = true;
    this.newPartenaire = { name: '', email: '', phone: '', status: 'pending' };
    this.resetMessages();
    this.isSubmitted = false;
  }

  onFileChange(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.editFiles[field] = input.files[0];
    }
  }

  getPreviewUrl(field: string): string | null {
    if (this.editFiles[field]) {
      return URL.createObjectURL(this.editFiles[field]);
    }
    return null;
  }

  /** ✅ Fonction pour corriger les URLs */
  getFileUrl(path: string | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http')) {
      return path; // Déjà une URL Cloudinary complète
    }
    return `https://yakalma.onrender.com/${path}`;
  }

  onAddSubmit(): void {
    this.isSubmitted = true;
    if (!this.newPartenaire.name || !this.newPartenaire.email || !this.newPartenaire.phone) {
      this.errorMessage = 'Tous les champs sont requis';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newPartenaire.name);
    formData.append('email', this.newPartenaire.email);
    formData.append('phone', this.newPartenaire.phone);
    formData.append('status', this.newPartenaire.status || 'pending');

    this.partenaireService.registerPartenaire(formData).subscribe({
      next: (p) => {
        this.partenaires.push(p);
        this.successMessage = 'Partenaire ajouté avec succès';
        setTimeout(() => this.closeAddModal(), 1000);
      },
      error: () => this.errorMessage = 'Erreur lors de l\'ajout.'
    });
  }

  openEditModal(p: Partenaire): void {
    this.selectedPartenaire = { ...p };
    this.selectedPartenaireId = p._id || null;
    this.isEditModalVisible = true;
    this.resetMessages();
    this.isEditSubmitted = false;
  }

  onEditSubmit(): void {
    this.isEditSubmitted = true;

    if (!this.selectedPartenaire.name || !this.selectedPartenaire.email || !this.selectedPartenaire.phone) {
      this.errorMessage = "Veuillez remplir les champs obligatoires.";
      return;
    }

    const formData = new FormData();
    formData.append('name', this.selectedPartenaire.name);
    formData.append('email', this.selectedPartenaire.email);
    formData.append('phone', this.selectedPartenaire.phone);
    formData.append('address', this.selectedPartenaire.address || '');
    formData.append('managerName', this.selectedPartenaire.managerName || '');
    formData.append('ninea', this.selectedPartenaire.ninea || '');

    for (const key in this.editFiles) {
      if (this.editFiles[key]) {
        formData.append(key, this.editFiles[key]);
      }
    }

    this.partenaireService.updatePartenaire(this.selectedPartenaire._id!, formData).subscribe({
      next: (updatedPartenaire) => {
        const index = this.partenaires.findIndex(p => p._id === this.selectedPartenaire._id);
        if (index !== -1) {
          this.partenaires[index] = updatedPartenaire;
        }

        this.successMessage = 'Partenaire modifié avec succès.';
        this.errorMessage = '';

        setTimeout(() => {
          this.isEditModalVisible = false;
          this.successMessage = '';
          this.editFiles = {};
          this.loadPartenaires();
        }, 1000);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la modification.';
        this.successMessage = '';
      }
    });
  }

  openDeleteModal(id: string): void {
    this.selectedPartenaireId = id;
    this.isDeleteModalVisible = true;
    this.resetMessages();
  }

  confirmDelete(): void {
    if (!this.selectedPartenaireId) return;

    this.partenaireService.deletePartenaire(this.selectedPartenaireId).subscribe({
      next: () => {
        this.partenaires = this.partenaires.filter(p => p._id !== this.selectedPartenaireId);
        this.successMessage = 'Supprimé avec succès';
        this.isDeleteModalVisible = false;
        this.selectedPartenaireId = null;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Erreur suppression partenaire :', err);
        this.errorMessage = 'Erreur de suppression';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  approvePartenaire(id: string): void {
    this.partenaireService.updatePartenaireStatus(id, 'approved').subscribe({
      next: () => {
        const index = this.partenaires.findIndex(p => p._id === id);
        if (index !== -1) {
          this.partenaires[index].status = 'approved';
        }
        this.successMessage = 'Partenaire approuvé avec succès !';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Erreur approbation partenaire :', err);
        this.errorMessage = 'Impossible d\'approuver le partenaire.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  rejectPartenaire(id: string): void {
    this.partenaireService.updatePartenaireStatus(id, 'rejected').subscribe({
      next: () => {
        const index = this.partenaires.findIndex(p => p._id === id);
        if (index !== -1) this.partenaires[index].status = 'rejected';
        this.successMessage = 'Partenaire rejeté avec succès !';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Erreur rejet partenaire :', err);
        this.errorMessage = 'Impossible de rejeter le partenaire.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  closeAddModal(): void { this.isAddModalVisible = false; }
  closeEditModal(): void { this.isEditModalVisible = false; }
  cancelDelete(): void { this.isDeleteModalVisible = false; }

  private resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
