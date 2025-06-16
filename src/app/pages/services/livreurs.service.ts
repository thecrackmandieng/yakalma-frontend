import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Livreur } from '../models/livreur.model';

@Injectable({
  providedIn: 'root'
})
export class LivreursService {
  private livreurs: Livreur[] = [
    { id: 1, nom: 'Doe', prenom: 'John' },
    { id: 2, nom: 'Smith', prenom: 'Jane' },
    { id: 3, nom: 'Johnson', prenom: 'Jim' }
  ];

  constructor() { }

  getLivreurs(): Observable<Livreur[]> {
    return of(this.livreurs);
  }

  addLivreur(livreur: Livreur): Observable<Livreur> {
    livreur.id = this.livreurs.length + 1;
    this.livreurs.push(livreur);
    return of(livreur);
  }

  updateLivreur(livreur: Livreur): Observable<Livreur> {
    const index = this.livreurs.findIndex(l => l.id === livreur.id);
    if (index !== -1) {
      this.livreurs[index] = livreur;
    }
    return of(livreur);
  }

  deleteLivreur(id: number): Observable<void> {
    this.livreurs = this.livreurs.filter(livreur => livreur.id !== id);
    return of();
  }
}
