import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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

  constructor(private webSocketService: WebSocketService, private cdr: ChangeDetectorRef) {}

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
            this.userExists = true; // Indiquer qu'un utilisateur existe
          } else {
            console.error('Aucune donnée valide reçue:', data);
            this.users = []; // Réinitialiser les utilisateurs si les données sont invalides
            this.userExists = false; // Aucun utilisateur existant
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

  // Méthode pour vérifier si un utilisateur existe
  hasUser(): boolean {
    return this.userExists;
  }

  // Méthode qui permet de revenir à l'écran par défaut après une action
  goToDefaultDashboard(): void {
    setTimeout(() => {
      this.userExists = false; // Réinitialiser l'état de l'utilisateur
      this.users = []; // Réinitialiser les informations utilisateur
      this.cdr.detectChanges(); // Détecter manuellement les changements de détection
    }, 100); // Ajouter un léger délai pour permettre au template de se mettre à jour correctement
  }

  // Méthode de validation après une action spécifique
  validateAction(): void {
    if (this.userExists) {
      console.log('Validation effectuée pour', this.users[0].nom);

      // Envoi d'un message WebSocket pour valider le pointage
      this.webSocketService.send({
        action: 'VALIDATE',  // Action spécifique pour valider
        user: this.users[0], // Envoi des informations de l'utilisateur
      });

      // Réinitialiser l'état après validation
      this.goToDefaultDashboard();
    }
  }

  rejectAction(): void {
    if (this.userExists) {
      console.log('Rejet effectué pour', this.users[0].nom);

      // Envoi d'un message WebSocket pour rejeter l'action
      this.webSocketService.send({
        action: 'REJECT',  // Action spécifique pour rejeter
        user: this.users[0], // Envoi des informations de l'utilisateur
      });

      // Réinitialiser l'état après rejet et revenir au dashboard par défaut
      this.goToDefaultDashboard();
    }
  }
}
