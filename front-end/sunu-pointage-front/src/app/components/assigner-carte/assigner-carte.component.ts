import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assigner-carte',
  templateUrl: './assigner-carte.component.html',
  styleUrls: ['./assigner-carte.component.css'],
})
export class AssignerCarteComponent implements OnInit {
  private wss!: WebSocket;
  cardId: string = '';
  userId!: string;
  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute ) {}

  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
          this.userId = id; // Assignation seulement si ce n'est pas null
          //console.log(this.userId);
      } else {
          // Gérer le cas où l'ID est null
          console.warn('ID du membre non trouvé');
          this.userId = ''; // Ou une autre logique
      }
    });

    this.connectToWebSocket();
  }

   // Connexion via WebSocket pour le RFID
   connectToWebSocket(): void {
    this.wss = new WebSocket('ws://localhost:3001');

    this.wss.onopen = () => {
      console.log('WebSocket connecté.');
    };

    this.wss.onerror = (error) => {
      console.error('Erreur WebSocket :', error);
    };

    this.wss.onclose = () => {
      console.log('WebSocket fermé. Tentative de reconnexion dans 5 secondes...');
      setTimeout(() => this.connectToWebSocket(), 5000);
    };

    this.wss.onmessage = (event) => {
      this.cardId = event.data;
      console.log(`UID reçu : ${this.cardId}`);
    }

   
  }

  assigneCard(){
    if(this.cardId !== ''){
      this.userService.assignCard(this.userId, this.cardId).subscribe({
        next: (res) =>{
          console.log(res);
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: res.message,
            showConfirmButton: false,
            timer: 1500
          })
          this.goBack();
        }, error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: err.error.error,
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
    }
  }

  
  // Méthode pour gérer le retour
  goBack(): void {
    this.router.navigate(['/gestion-cartes']);
  }
}
