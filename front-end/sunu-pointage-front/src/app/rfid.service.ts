import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RFIDService {
  private socket: Socket;
  private rfidScanned = new Subject<string>();
  public rfidScanned$ = this.rfidScanned.asObservable();
  private isConnected = false;

  constructor() {
    this.setupSocketConnection();
  }

  private setupSocketConnection() {
    try {
      this.socket = io(environment.websocketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Connecté au serveur WebSocket');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Déconnecté du serveur WebSocket');
        this.isConnected = false;
      });

      this.socket.on('rfidScanned', (uid: string) => {
        console.log('Carte RFID détectée:', uid);
        this.rfidScanned.next(uid);
      });

      this.socket.on('connect_error', (error: Error) => {
        console.error('Erreur de connexion WebSocket:', error);
      });

    } catch (error) {
      console.error('Erreur lors de la configuration de Socket.IO:', error);
    }
  }

  // Méthode pour vérifier l'état de la connexion
  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Méthode pour reconnecter manuellement
  reconnect() {
    if (this.socket) {
      this.socket.connect();
    }
  }

  // Méthode pour déconnecter proprement
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}