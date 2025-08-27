import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LivreursService } from '../../../services/livreurs.service';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';

interface Livreur {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  status: string;
  idCardCopy: string;
  insuranceCopy: string;
}

@Component({
  selector: 'app-livreurs',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent, SafeUrlPipe],
  templateUrl: './livreurs.component.html',
  styleUrls: ['./livreurs.component.css']
})
export class LivreursComponent implements OnInit {
  livreurs: Livreur[] = [];
  isAddModalVisible = false;
  isEditModalVisible = false;
  isDeleteModalVisible = false;
  isDocumentModalVisible = false;
  formStep = 1;

  fileInputs: { [key: string]: File | null } = {
    idCardCopy: null,
    insuranceCopy: null,
  };

  newLivreur: Partial<Livreur> = {
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
    status: 'incomplete'
  };

  selectedLivreur: Livreur | null = null;
  selectedLivreurId: string | null = null;
  selectedDocuments: { name: string; url: string }[] = [];
  selectedEditFiles: { [key: string]: File | null } = {
    idCardCopy: null,
    insuranceCopy: null,
  };

  errorMessage = '';
  successMessage = '';
  isSubmitted = false;
  isEditSubmitted = false;

  constructor(private livreursService: LivreursService) {}

  ngOnInit(): void {
    this.loadLivreurs();
  }

  loadLivreurs() {
    this.livreursService.getLivreurs().subscribe({
      next: (data: any[]) => {
        this.livreurs = data.map(l => ({
          ...l,
          id: l._id || l.id
        }));
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des livreurs.';
        console.error(error);
      }
    });
  }

  // -------------------- MODAL ADD --------------------
  openAddLivreurModal(): void {
    this.isAddModalVisible = true;
    this.resetForm();
  }

  closeAddModal(): void {
    this.isAddModalVisible = false;
    this.resetForm();
  }

  private resetForm() {
    this.formStep = 1;
    this.fileInputs = { idCardCopy: null, insuranceCopy: null };
    this.newLivreur = {
      name: '',
      email: '',
      phone: '',
      vehicleType: '',
      vehicleNumber: '',
      status: 'incomplete'
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitted = false;
  }

  goToStep2(event: Event): void {
    event.preventDefault();
    if (!this.newLivreur.email) {
      this.errorMessage = 'L\'email est requis pour la pré-inscription.';
      return;
    }

    this.livreursService.preRegisterLivreur(this.newLivreur.email).subscribe({
      next: () => {
        this.errorMessage = '';
        this.formStep = 2;
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Erreur lors de la pré-inscription.';
        console.error(err);
      }
    });
  }

  onFileChange(event: any, type: 'idCardCopy' | 'insuranceCopy') {
    const file = event.target.files[0];
    if (file) {
      this.fileInputs[type] = file;
    }
  }

  onAddSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newLivreur.name || !this.newLivreur.phone || !this.newLivreur.vehicleType || !this.newLivreur.vehicleNumber) {
      this.errorMessage = 'Veuillez remplir tous les champs requis à l\'étape 2.';
      return;
    }

    if (!this.fileInputs['idCardCopy'] || !this.fileInputs['insuranceCopy']) {
      this.errorMessage = 'Veuillez sélectionner les fichiers requis.';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newLivreur.name);
    formData.append('email', this.newLivreur.email!);
    formData.append('phone', this.newLivreur.phone);
    formData.append('vehicleType', this.newLivreur.vehicleType);
    formData.append('vehicleNumber', this.newLivreur.vehicleNumber);

    // Supprime espaces et encode
    formData.append('idCardCopy', this.sanitizeFile(this.fileInputs['idCardCopy']!));
    formData.append('insuranceCopy', this.sanitizeFile(this.fileInputs['insuranceCopy']!));

    this.livreursService.registerLivreur(formData).subscribe({
      next: () => {
        this.successMessage = 'Livreur ajouté avec succès !';
        this.loadLivreurs();
        setTimeout(() => {
          this.successMessage = '';
          this.closeAddModal();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout du livreur.';
        console.error(error);
      }
    });
  }

  // -------------------- MODAL EDIT --------------------
  openEditLivreurModal(livreur: Livreur): void {
    this.selectedLivreur = { ...livreur };
    this.isEditModalVisible = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.isEditSubmitted = false;
    this.selectedEditFiles = { idCardCopy: null, insuranceCopy: null };
  }

  closeEditModal(): void {
    this.isEditModalVisible = false;
    this.selectedLivreur = null;
    this.selectedEditFiles = { idCardCopy: null, insuranceCopy: null };
  }

  onEditFileChange(event: any, type: 'idCardCopy' | 'insuranceCopy') {
    const file = event.target.files[0];
    if (file) {
      this.selectedEditFiles[type] = file;
    }
  }

  onEditSubmit(): void {
    if (!this.selectedLivreur || !this.selectedLivreur.id) {
      this.errorMessage = 'ID du livreur invalide.';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.selectedLivreur.name);
    formData.append('phone', this.selectedLivreur.phone);
    formData.append('vehicleType', this.selectedLivreur.vehicleType);
    formData.append('vehicleNumber', this.selectedLivreur.vehicleNumber);

    if (this.selectedEditFiles['idCardCopy']) {
      formData.append('idCardCopy', this.sanitizeFile(this.selectedEditFiles['idCardCopy']));
    }
    if (this.selectedEditFiles['insuranceCopy']) {
      formData.append('insuranceCopy', this.sanitizeFile(this.selectedEditFiles['insuranceCopy']));
    }

    this.livreursService.updateLivreur(this.selectedLivreur.id, formData).subscribe({
      next: () => {
        this.successMessage = 'Livreur mis à jour avec succès !';
        this.loadLivreurs();
        setTimeout(() => {
          this.successMessage = '';
          this.closeEditModal();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour.';
        console.error(error);
      }
    });
  }

  // -------------------- DELETE --------------------
  openDeleteModal(id: string): void {
    this.selectedLivreurId = id;
    this.isDeleteModalVisible = true;
  }

  cancelDelete(): void {
    this.isDeleteModalVisible = false;
    this.selectedLivreurId = null;
  }

  confirmDelete(): void {
    if (!this.selectedLivreurId) return;

    this.livreursService.deleteLivreur(this.selectedLivreurId).subscribe({
      next: () => {
        this.livreurs = this.livreurs.filter(l => l.id !== this.selectedLivreurId);
        this.successMessage = 'Livreur supprimé avec succès !';
        setTimeout(() => {
          this.successMessage = '';
          this.cancelDelete();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la suppression.';
        console.error(error);
      }
    });
  }

  // -------------------- DOCUMENTS --------------------
  public getFileUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const encodedPath = encodeURI(path.replace(/ /g, '_')); // remplace espace par _
    return `https://yakalma.onrender.com/${encodedPath}`;
  }

  viewDocuments(id: string): void {
    const livreur = this.livreurs.find(l => l.id === id);
    if (!livreur) return;

    this.selectedDocuments = [];

    if (livreur.idCardCopy) {
      this.selectedDocuments.push({
        name: "Carte d'identité",
        url: this.getFileUrl(livreur.idCardCopy)
      });
    }
    if (livreur.insuranceCopy) {
      this.selectedDocuments.push({
        name: "Assurance",
        url: this.getFileUrl(livreur.insuranceCopy)
      });
    }

    this.isDocumentModalVisible = true;
  }

  closeDocumentModal(): void {
    this.isDocumentModalVisible = false;
    this.selectedDocuments = [];
  }

  // -------------------- STATUS --------------------
  approveLivreur(id: string): void {
    this.livreursService.updateLivreurStatus(id, 'approved').subscribe({
      next: () => {
        const index = this.livreurs.findIndex(l => l.id === id);
        if (index !== -1) this.livreurs[index].status = 'approved';
        this.successMessage = 'Livreur approuvé avec succès !';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Erreur approbation livreur :', err);
        this.errorMessage = 'Impossible d\'approuver le livreur.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  rejectLivreur(id: string): void {
    this.livreursService.updateLivreurStatus(id, 'rejected').subscribe({
      next: () => {
        const index = this.livreurs.findIndex(l => l.id === id);
        if (index !== -1) this.livreurs[index].status = 'rejected';
        this.successMessage = 'Livreur rejeté avec succès !';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Erreur rejet livreur :', err);
        this.errorMessage = 'Impossible de rejeter le livreur.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  editLivreur(livreur: Livreur): void {
    this.openEditLivreurModal(livreur);
  }

  // -------------------- UTILS --------------------
  private sanitizeFile(file: File): File {
    // Remplace les espaces dans le nom par "_"
    const newName = file.name.replace(/\s/g, '_');
    return new File([file], newName, { type: file.type });
  }
}
