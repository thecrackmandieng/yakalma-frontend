import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export class SSRAuthUtils {
  static isBrowser(): boolean {
    const platformId = inject(PLATFORM_ID);
    return isPlatformBrowser(platformId);
  }

  static getTokenSafely(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token') || localStorage.getItem('authToken');
    }
    return null;
  }

  static shouldSkipAuth(): boolean {
    return typeof window === 'undefined';
  }
}
