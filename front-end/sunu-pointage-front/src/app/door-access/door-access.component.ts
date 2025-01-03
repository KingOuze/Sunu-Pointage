import { Component } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Component({
  selector: 'app-door-access',
  templateUrl: './door-access.component.html',
  standalone: true,
  styleUrls: ['./door-access.component.css'],
})
export class DoorAccessComponent {
  isDoorOpen: boolean = false; // État de la porte
  errorMessage: string | null = null; // Message d'erreur en cas d'accès refusé

  constructor(private webSocketService: WebSocketService) {
    // Connexion WebSocket et gestion des messages reçus
    this.webSocketService.connect().subscribe((message) => {
      console.log('Message reçu du WebSocket:', message);

      // Vérification si l'utilisateur est bloqué ou n'existe pas
      if (message.success === false) {
        // L'utilisateur est soit bloqué, soit inexistant
        this.errorMessage = message.message; // Affiche le message d'erreur
        this.isDoorOpen = false;  // La porte reste fermée si l'accès est refusé
      } else {
        this.errorMessage = null;
      }
    });
  }

  // Méthode pour basculer l'état de la porte
  toggleDoor(): void {
    if (this.errorMessage) {
      // Si un message d'erreur est présent, empêcher l'ouverture de la porte
      console.log('Accès refusé, la porte ne s\'ouvrira pas.');
      return;
    }

    console.log('État avant bascule:', this.isDoorOpen); // Affiche l'état actuel de la porte
    this.isDoorOpen = !this.isDoorOpen;
    const command = this.isDoorOpen ? 'OPEN' : 'CLOSE';
    console.log('Commande envoyée:', command); // Affiche la commande envoyée
    this.sendCommand(command);
  }

  // Envoyer la commande via le service WebSocket
  private sendCommand(command: string): void {
    this.webSocketService.sendCommand({ action: command });
  }
}
