import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { RouterModule } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes)),  // Ajout de RouterModule
    provideHttpClient(withFetch())  // Configure HttpClient pour utiliser fetch
  ]
}).catch((err) => console.error('Erreur lors du bootstrap :', err));
