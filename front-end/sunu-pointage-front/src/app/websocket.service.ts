import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket; // WebSocket instance
  private reconnectInterval = 5000; // Intervalle de reconnexion
  private messageQueue: any[] = []; // File pour les messages en attente
  private isConnecting = false; // Évite les multiples tentatives de connexion simultanées

  private messages$: Subject<any> = new Subject(); // Pour diffuser les messages reçus

  constructor() {}

  // Connexion au WebSocket
  connect(): Observable<any> {
    this.initializeConnection(); // Initie la connexion
    return this.messages$.asObservable(); // Retourne un observable pour écouter les messages
  }

  // Initialisation de la connexion WebSocket
  private initializeConnection(): void {
    if (this.isConnecting) return; // Empêche les tentatives multiples
    this.isConnecting = true;

    console.log('Tentative de connexion au WebSocket...');
    this.socket = new WebSocket('ws://localhost:5000');

    // Gestion des événements WebSocket
    this.socket.onopen = () => {
      console.log('WebSocket connecté avec succès.');
      this.isConnecting = false;

      // Envoi des messages en attente dans la file
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        this.sendMessage(message);
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (parsedData) {
          this.messages$.next(parsedData); // Diffusion des messages reçus
        } else {
          throw new Error('Données reçues au format invalide.');
        }
      } catch (error) {
        console.error('Erreur lors du traitement des données WebSocket:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket détectée:', error);
      this.reconnect(); // Reconnexion automatique
    };

    this.socket.onclose = () => {
      console.warn('Connexion WebSocket fermée. Tentative de reconnexion...');
      this.reconnect(); // Reconnexion automatique
    };
  }

  // Reconnexion au WebSocket
  private reconnect(): void {
    this.isConnecting = false;
    setTimeout(() => this.initializeConnection(), this.reconnectInterval);
  }

  // Déconnexion du WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  // Envoi de commande simple
  sendCommand(command: { action: string }): void {
    this.sendMessage(command);
  }

  // Envoi de commande avec informations utilisateur
  send(command: { action: string; status: String; user: any }): void {
    this.sendMessage(command);
  }

  // Envoi générique de message
  private sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket non connecté. Ajout du message à la file d\'attente.');
      this.messageQueue.push(message); // Ajout du message à la file en attente
    }
  }
}