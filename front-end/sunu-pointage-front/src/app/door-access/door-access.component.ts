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

  constructor(private webSocketService: WebSocketService) {}

  // Méthode pour basculer l'état de la porte
  toggleDoor(): void {
    this.isDoorOpen = !this.isDoorOpen;
    const command = this.isDoorOpen ? 'OPEN' : 'CLOSE';
    this.sendCommand(command);
  }

  // Envoyer la commande via le service WebSocket
  private sendCommand(command: string): void {
    this.webSocketService.sendCommand({ action: command });
  }
}
