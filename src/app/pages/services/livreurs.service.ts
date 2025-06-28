import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Livreur } from '../models/livreur.model';

@Injectable({
  providedIn: 'root'
})
export class LivreursService {
  private livreurs: Livreur[] = [
    { id: 1, nom: 'Doe', prenom: 'John', status: 'active', email: 'mousta@gmail.com', telephone: '123456789' },
    { id: 2, nom: 'Smith', prenom: 'Jane', status: 'inactive', email: 'momy@gmail.com', telephone: '987654321' },
    { id: 3, nom: 'Johnson', prenom: 'Jim', status: 'active', email: 'fallou@gmail.com', telephone: '456789123' },
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
