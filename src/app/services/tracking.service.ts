import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { Position } from './geolocation.service';

type Socket = ReturnType<typeof io>;

export interface TrackingData {
  livreurId: string;
  orderId: string;
  position: Position;
  timestamp: number;
  status: 'en_route' | 'arrived' | 'delivered';
}

export interface ETAData {
  orderId: string;
  estimatedTime: number; // minutes
  distance: number; // km
  currentPosition: Position;
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private socket!: Socket; // Utilisation de l'opérateur de non-null assertion
  private trackingData = new BehaviorSubject<TrackingData | null>(null);
  private etaData = new BehaviorSubject<ETAData | null>(null);
  private isBrowser: boolean = false;

  public trackingData$ = this.trackingData.asObservable();
  public etaData$ = this.etaData.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      // Connexion au serveur WebSocket avec meilleure gestion d'erreur
      try {
        this.socket = io('https://yakalma.onrender.com', {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          forceNew: true,
          autoConnect: true
        }) as unknown as Socket;

        this.setupSocketListeners();
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la connexion WebSocket:', error);
        // Tentative de reconnexion après un délai
        setTimeout(() => {
          this.reconnect();
        }, 5000);
      }
    } else {
      console.log('TrackingService: Server-side rendering - socket.io not initialized');
    }
  }

  /** 🚀 Commencer le suivi d'une commande */
  startTracking(orderId: string, clientId: string): void {
    if (!this.isBrowser) {
      console.warn('⚠️ startTracking appelé côté serveur - ignoré');
      return;
    }
    
    try {
      if (this.socket && this.socket.connected) {
        this.socket.emit('start_tracking', { orderId, clientId });
      } else {
        console.warn('⚠️ WebSocket non connecté, tentative de reconnexion...');
        this.reconnect();
        // Réessayer après un court délai
        setTimeout(() => {
          if (this.socket && this.socket.connected) {
            this.socket.emit('start_tracking', { orderId, clientId });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Erreur lors du démarrage du suivi:', error);
    }
  }

  /** 🛑 Arrêter le suivi */
  stopTracking(orderId: string): void {
    if (!this.isBrowser) {
      console.warn('⚠️ stopTracking appelé côté serveur - ignoré');
      return;
    }
    
    try {
      if (this.socket && this.socket.connected) {
        this.socket.emit('stop_tracking', { orderId });
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'arrêt du suivi:', error);
    }
  }

  /** 📍 Mettre à jour la position du livreur */
  updateLivreurPosition(orderId: string, livreurId: string, position: Position): void {
    if (!this.isBrowser) {
      console.warn('⚠️ updateLivreurPosition appelé côté serveur - ignoré');
      return;
    }
    
    try {
      if (this.socket && this.socket.connected) {
        const trackingData: TrackingData = {
          livreurId,
          orderId,
          position,
          timestamp: Date.now(),
          status: 'en_route'
        };

        this.socket.emit('livreur_position_update', trackingData);
      } else {
        console.warn('⚠️ WebSocket non connecté, impossible de mettre à jour la position');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la position:', error);
    }
  }

  /** 🎯 Marquer comme arrivé */
  markAsArrived(orderId: string, livreurId: string): void {
    if (!this.isBrowser) {
      console.warn('⚠️ markAsArrived appelé côté serveur - ignoré');
      return;
    }
    
    try {
      if (this.socket && this.socket.connected) {
        this.socket.emit('livreur_arrived', { orderId, livreurId });
      }
    } catch (error) {
      console.error('❌ Erreur lors du marquage comme arrivé:', error);
    }
  }

  /** ✅ Marquer comme livré */
  markAsDelivered(orderId: string, livreurId: string): void {
    if (!this.isBrowser) {
      console.warn('⚠️ markAsDelivered appelé côté serveur - ignoré');
      return;
    }
    
    try {
      if (this.socket && this.socket.connected) {
        this.socket.emit('order_delivered', { orderId, livreurId });
      }
    } catch (error) {
      console.error('❌ Erreur lors du marquage comme livré:', error);
    }
  }

  /** 📊 Obtenir les données de suivi en temps réel */
  getTrackingData(orderId: string): Observable<TrackingData> {
    if (!this.isBrowser) {
      console.warn('⚠️ getTrackingData appelé côté serveur - retourne Observable vide');
      return new Observable(observer => {
        observer.complete();
      });
    }
    
    return new Observable(observer => {
      this.socket.on(`tracking_update_${orderId}`, (data: TrackingData) => {
        this.trackingData.next(data);
        observer.next(data);
      });

      return () => {
        this.socket.off(`tracking_update_${orderId}`);
      };
    });
  }

  /** ⏱️ Obtenir l'ETA mis à jour */
  getETAUpdates(orderId: string): Observable<ETAData> {
    if (!this.isBrowser) {
      console.warn('⚠️ getETAUpdates appelé côté serveur - retourne Observable vide');
      return new Observable(observer => {
        observer.complete();
      });
    }
    
    return new Observable(observer => {
      this.socket.on(`eta_update_${orderId}`, (data: ETAData) => {
        this.etaData.next(data);
        observer.next(data);
      });

      return () => {
        this.socket.off(`eta_update_${orderId}`);
      };
    });
  }

  /** 📋 Obtenir l'historique des positions */
  getTrackingHistory(orderId: string): Promise<TrackingData[]> {
    if (!this.isBrowser) {
      console.warn('⚠️ getTrackingHistory appelé côté serveur - retourne Promise vide');
      return Promise.resolve([]);
    }
    
    return new Promise((resolve, reject) => {
      this.socket.emit('get_tracking_history', { orderId });

      this.socket.once(`tracking_history_${orderId}`, (data: { history: TrackingData[] }) => {
        resolve(data.history);
      });

      this.socket.once('error', (error: Error) => {
        reject(error);
      });
    });
  }

  /** 🔌 Déconnexion propre */
  disconnect(): void {
    if (!this.isBrowser) {
      console.warn('⚠️ disconnect appelé côté serveur - ignoré');
      return;
    }
    
    try {
      if (this.socket) {
        this.socket.disconnect();
        console.log('🔌 Déconnexion WebSocket effectuée');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    }
  }

  /** 🔗 Reconnexion */
  reconnect(): void {
    if (!this.isBrowser) {
      console.warn('⚠️ reconnect appelé côté serveur - ignoré');
      return;
    }
    
    try {
      if (this.socket) {
        if (!this.socket.connected) {
          this.socket.connect();
          console.log('🔄 Tentative de reconnexion WebSocket');
        }
      } else {
        // Réinitialiser complètement la connexion si le socket n'existe pas
        console.log('🔄 Réinitialisation de la connexion WebSocket');
        this.initializeSocket();
      }
    } catch (error) {
      console.error('❌ Erreur lors de la reconnexion:', error);
      // Réessayer après un délai en cas d'échec
      setTimeout(() => this.reconnect(), 3000);
    }
  }

  /** 🔄 Réinitialiser complètement la connexion socket */
  private initializeSocket(): void {
    if (!this.isBrowser) {
      console.warn('⚠️ initializeSocket appelé côté serveur - ignoré');
      return;
    }
    
    try {
      this.socket = io('https://yakalma.onrender.com', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true,
        autoConnect: true
      }) as unknown as Socket;

      this.setupSocketListeners();
      console.log('✅ Connexion WebSocket réinitialisée');
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation de la connexion:', error);
    }
  }

  /** 📡 Configuration des écouteurs Socket.IO */
  private setupSocketListeners(): void {
    if (!this.isBrowser) {
      console.warn('⚠️ setupSocketListeners appelé côté serveur - ignoré');
      return;
    }
    
    this.socket.on('connect', () => {
      console.log('✅ Connecté au serveur de suivi');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur de suivi');
    });

    this.socket.on('error', (error: Error) => {
      console.error('❌ Erreur WebSocket:', error);
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log(`🔄 Reconnexion réussie (tentative ${attemptNumber})`);
    });
  }

  /** 📊 Vérifier l'état de la connexion */
  isConnected(): boolean {
    if (!this.isBrowser) {
      console.warn('⚠️ isConnected appelé côté serveur - retourne false');
      return false;
    }
    
    return this.socket && this.socket.connected;
  }
}
