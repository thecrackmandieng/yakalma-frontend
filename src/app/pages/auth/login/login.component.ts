import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Assure-toi d'importer FormsModule

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule] // Ajout de HttpClientModule ici
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(event: Event) {
    event.preventDefault();
    this.http.post('http://localhost:5000/api/auth/login', { email: this.email, password: this.password })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          this.redirectBasedOnRole(response.role);
        },
        error: (err) => console.error('Erreur lors de la connexion :', err),
      });
  }

  private redirectBasedOnRole(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'restaurant') {
      this.router.navigate(['/restaurant/dashboard']);
    } else if (role === 'livreur') {
      this.router.navigate(['/livreur/dashboard']);
    } else {
      this.router.navigate(['/client/dashboard']);
    }
  }
}
