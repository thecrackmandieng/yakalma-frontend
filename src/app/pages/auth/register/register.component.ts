import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Assure-toi d'importer FormsModule
import { HttpClientModule } from '@angular/common/http'; // Ajout de HttpClientModule
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule] // Ajoute HttpClientModule ici
})
export class RegisterComponent {
  email = '';
  password = '';
  role = '';
  errorMessage = ''; // Pour afficher les erreurs côté utilisateur
  successMessage = ''; // Pour afficher le message de succès

  constructor(private http: HttpClient, private router: Router) {}

  register(event: Event) {
    event.preventDefault();

    // Envoi des données à l'API
    this.http.post('http://localhost:3000/api/auth/register', {
      email: this.email,
      password: this.password,
      role: this.role
    })
    .subscribe({
      next: (response: any) => {
        // Affiche un message de succès et redirige vers la page de connexion
        this.successMessage = 'Inscription réussie ! Redirection vers la page de connexion.';
        setTimeout(() => this.router.navigate(['/login']), 2000); // Redirection après 2 secondes
      },
      error: (err: any) => {
        // Affiche le message d'erreur si l'inscription échoue
        if (err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Erreur inconnue. Veuillez réessayer.';
        }
      },
    });
  }
}
