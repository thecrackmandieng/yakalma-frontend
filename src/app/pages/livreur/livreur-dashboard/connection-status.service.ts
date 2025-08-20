import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  private socketConnectedSubject = new BehaviorSubject<boolean>(false);

  public isOnline$ = this.isOnlineSubject.asObservable();
  public socketConnected$ = this.socketConnectedSubject.asObservable();

  constructor() {
    // Écouter les changements de connexion réseau
    window.addEventListener('online', () => this.isOnlineSubject.next(true));
    window.addEventListener('offline', () => this.isOnlineSubject.next(false));
  }

  setSocketConnected(status: boolean): void {
    this.socketConnectedSubject.next(status);
  }

  getConnectionStatus(): { online: boolean; socketConnected: boolean } {
    return {
      online: this.isOnlineSubject.value,
      socketConnected: this.socketConnectedSubject.value
    };
  }

  isFullyConnected(): boolean {
    return this.isOnlineSubject.value && this.socketConnectedSubject.value;
  }
}
