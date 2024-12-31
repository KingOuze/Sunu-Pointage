import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;  // Utilisation de l'opérateur '!' pour indiquer que 'socket' sera initialisé

  constructor() {}

  // Méthode pour connecter au WebSocket
  connect(): Observable<any> {
    this.socket = new WebSocket('ws://localhost:3000'); // URL de votre serveur WebSocket
    return new Observable(observer => {
      this.socket.onmessage = (event) => {
        observer.next(JSON.parse(event.data)); // Envoie des données au frontend
      };
      this.socket.onerror = (error) => {
        observer.error(error);
      };
      this.socket.onclose = () => {
        observer.complete();
      };
    });
  }

  // Méthode pour fermer la connexion WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  // Méthode pour envoyer une commande via WebSocket
  sendCommand(command: { action: string }): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(command));
    } else {
      console.error('WebSocket n\'est pas connecté.');
    }
  }

  // Méthode pour envoyer un message plus complexe via WebSocket
  send(command: { action: string; user: any }): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(command));
    } else {
      console.error('WebSocket n\'est pas connecté.');
    }
  }
}
