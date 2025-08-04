import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors
} from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { RouterModule } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    // Rendu des routes Angular standalone
    importProvidersFrom(RouterModule.forRoot(routes)),

    // Configuration HttpClient : fetch + intercepteur JWT
    provideHttpClient(
      withFetch(),
      withInterceptors([
        (req, next) => {
          const token = localStorage.getItem('token');
          if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          return next(req);
        }
      ])
    )
  ]
}).catch((err) =>
  console.error('Erreur lors du bootstrap de l’application :', err)
);
