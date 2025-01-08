import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { WebSocketService } from '../websocket.service'; // Import du service WebSocket
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ClockComponent } from '../clock/clock.component';
import { DoorAccessComponent } from '../door-access/door-access.component';
import { Router } from '@angular/router'; // Importer Router
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard-vigile',
  templateUrl: './dashboard-vigile.component.html',
  standalone: true,
  imports: [ClockComponent, DoorAccessComponent, CommonModule],
  styleUrls: ['./dashboard-vigile.component.css']
})
export class DashboardVigileComponent implements OnInit, OnDestroy {
  users: any[] = []; // Pour stocker les utilisateurs récupérés
  userExists: boolean = false; // Variable pour vérifier si un utilisateur est trouvé
  errorMessage: string = ''; // Pour afficher les messages d'erreur métier
  private unsubscribe$ = new Subject<void>(); // Pour gérer les désabonnements

  constructor(private webSocketService: WebSocketService, private cdr: ChangeDetectorRef,private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Connexion au WebSocket et réception des données en temps réel
    this.webSocketService.connect()
      .pipe(takeUntil(this.unsubscribe$)) // Utilisation de takeUntil pour se désabonner automatiquement
      .subscribe(
        (data) => {
          console.log('Données WebSocket reçues:', data);

          if (data) {
            // Vérifier que les données reçues sont valides
            if (data.success === false) {
              // Gestion des erreurs métier renvoyées par le serveur
              this.errorMessage = data.message || 'Une erreur métier est survenue.';
              console.warn('Erreur métier:', this.errorMessage);

              this.users = []; // Réinitialiser les utilisateurs
              this.userExists = false; // Aucun utilisateur trouvé
            } else if (data.user && typeof data.user === 'object') {
              // Données valides avec un utilisateur
              this.users = [data.user];
              this.userExists = true;
              this.errorMessage = ''; // Réinitialiser les messages d'erreur
            } else {
              // Cas où aucune donnée utilisateur valide n'est envoyée
              console.error('Aucune donnée valide reçue:', data);
              this.errorMessage = 'Données invalides reçues.';
              this.users = [];
              this.userExists = false;
            }
          } else {
            console.error('Aucune donnée reçue du WebSocket.');
            this.errorMessage = 'Aucune donnée reçue.';
          }

          // Détecter les changements pour mettre à jour l'interface
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Erreur WebSocket:', error);
          this.errorMessage = 'Erreur de connexion WebSocket.';
          this.cdr.detectChanges();
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
      this.errorMessage = ''; // Réinitialiser les messages d'erreur
      this.cdr.detectChanges(); // Détecter manuellement les changements
    }, 100); // Ajouter un léger délai pour permettre au template de se mettre à jour correctement
  }
  

  checkinAction(): void {
    if (this.userExists) {
      console.log('Utilisateur trouvé:', this.users[0]); // Vérifiez les données de l'utilisateur
      console.log('Check-in effectué pour', this.users[0].nom);
      const status = 'VALIDATE';
      this.webSocketService.send({
        action: 'CHECKIN',
        status,
        user: this.users[0],
      });
      this.goToDefaultDashboard();
    } else {
      console.error('Aucun utilisateur trouvé pour l\'action de check-in');
    }
  }
  
  checkoutAction(): void {
    if (this.userExists) {
      console.log('Utilisateur trouvé:', this.users[0]); // Vérifiez les données de l'utilisateur
      console.log('Check-out effectué pour', this.users[0].nom);
      const status = 'VALIDATE';
      this.webSocketService.send({
        action: 'CHECKOUT',
        status,
        user: this.users[0],
      });
      this.goToDefaultDashboard();
    } else {
      console.error('Aucun utilisateur trouvé pour l\'action de check-out');
    }
  }
  // Méthode pour fermer le modal
  closeModal(): void {
    this.goToDefaultDashboard();
  }
  
  validateAction(): void {
    if (this.userExists && this.users.length > 0) {
      const currentUser = this.users[0]; // Récupère le premier utilisateur
      const currentStatus = currentUser.status?.toLowerCase() || 'checkin'; // Valeur par défaut : 'checkin'
      const status = 'VALIDATE';
      // Détermine l'action à effectuer
      const action = currentStatus === 'checkin' ? 'CHECKOUT' : 'CHECKIN';
      console.log(`${action} effectué pour`, currentUser.nom);
  
      // Envoi de l'action via WebSocket
      this.webSocketService.send({
        action: action,
        status,
        user: currentUser,
      });
  
      // Redirection ou autre traitement après validation
      this.goToDefaultDashboard();
    } else {
      console.warn('Aucun utilisateur disponible ou non détecté.');
      alert('Veuillez détecter un utilisateur avant de valider.');
    }
  }
  

  rejectAction(): void {
    if (this.userExists) {
      console.log('Rejet effectué pour', this.users[0].nom);
      const status = 'REJECT';
      this.webSocketService.send({
        action: 'REJECT',
        status,
        user: this.users[0],
      });
      this.goToDefaultDashboard();
    }
  }

  logout() {
    console.log('logout');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/connexion']);
  }
}