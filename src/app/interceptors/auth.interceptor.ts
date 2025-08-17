import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only add token on browser side
    if (!isPlatformBrowser(this.platformId)) {
      return next.handle(request);
    }

    // Skip token for auth endpoints
    const skipUrls = ['/auth/login', '/pre-register', '/register'];
    const shouldSkip = skipUrls.some(url => request.url.includes(url));
    
    if (shouldSkip) {
      return next.handle(request);
    }

    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
