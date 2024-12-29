import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../websocket.service'; // Import du service WebSocket
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ClockComponent } from '../clock/clock.component';
import { DoorAccessComponent } from '../door-access/door-access.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-vigile.component.html',
  standalone: true,
  imports: [ClockComponent, DoorAccessComponent, CommonModule],
  styleUrls: ['./dashboard-vigile.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  users: any[] = []; // Pour stocker les utilisateurs récupérés
  userExists: boolean = false; // Variable pour vérifier si un utilisateur est trouvé
  private unsubscribe$ = new Subject<void>(); // Pour gérer les désabonnements

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    // Connexion au WebSocket et réception des données en temps réel
    this.webSocketService.connect()
      .pipe(takeUntil(this.unsubscribe$)) // Utilisation de takeUntil pour se désabonner automatiquement
      .subscribe(
        (data) => {
          console.log('Données WebSocket reçues:', data);

          // Vérifiez si 'data.user' existe avant de l'utiliser
          if (data && data.user) {
            this.users = [data.user]; // Mise à jour des utilisateurs avec l'utilisateur reçu
            this.userExists = this.users.length > 0; // Vérification s'il y a un utilisateur
          } else {
            console.error('Aucune donnée valide reçue:', data);
            this.users = []; // Réinitialiser les utilisateurs si les données sont invalides
            this.userExists = false;
          }
        },
        (error) => {
          console.error('Erreur WebSocket:', error);
        }
      );
  }

  ngOnDestroy(): void {
    // Se désabonner lors de la destruction du composant pour éviter les fuites de mémoire
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // Méthode pour vérifier si un utilisateur existe (si un utilisateur est détecté)
  hasUser(): boolean { // Renommée pour éviter la duplication
    return this.userExists;
  }
}
