import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { Position } from './geolocation.service';

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
  private socket: Socket;
  private trackingData = new BehaviorSubject<TrackingData | null>(null);
  private etaData = new BehaviorSubject<ETAData | null>(null);

  public trackingData$ = this.trackingData.asObservable();
  public etaData$ = this.etaData.asObservable();

  constructor() {
    // Connexion au serveur WebSocket
    this.socket = io('https://yakalma.onrender.com', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupSocketListeners();
  }

  /** 🚀 Commencer le suivi d'une commande */
  startTracking(orderId: string, clientId: string): void {
    this.socket.emit('start_tracking', { orderId, clientId });
  }

  /** 🛑 Arrêter le suivi */
  stopTracking(orderId: string): void {
    this.socket.emit('stop_tracking', { orderId });
  }

  /** 📍 Mettre à jour la position du livreur */
  updateLivreurPosition(orderId: string, livreurId: string, position: Position): void {
    const trackingData: TrackingData = {
      livreurId,
      orderId,
      position,
      timestamp: Date.now(),
      status: 'en_route'
    };
    
    this.socket.emit('livreur_position_update', trackingData);
  }

  /** 🎯 Marquer comme arrivé */
  markAsArrived(orderId: string, livreurId: string): void {
    this.socket.emit('livreur_arrived', { orderId, livreurId });
  }

  /** ✅ Marquer comme livré */
  markAsDelivered(orderId: string, livreurId: string): void {
    this.socket.emit('order_delivered', { orderId, livreurId });
  }

  /** 📊 Obtenir les données de suivi en temps réel */
  getTrackingData(orderId: string): Observable<TrackingData> {
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
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  /** 🔗 Reconnexion */
  reconnect(): void {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }

  /** 📡 Configuration des écouteurs Socket.IO */
  private setupSocketListeners(): void {
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
    return this.socket && this.socket.connected;
  }
}
