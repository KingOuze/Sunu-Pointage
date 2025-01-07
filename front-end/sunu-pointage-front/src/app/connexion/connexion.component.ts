import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rfid-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  private ws!: WebSocket;

  // Modèles pour la connexion par email et mot de passe
  email: string = '';
  password: string = '';
  loginError: string = '';
  rfidErrorMessage: string = '';


  // Propriétés de contrôle
  isPasswordVisible: boolean = false;
  emailInvalid: boolean = false;
  errorMessage: string = ''; // Message d'erreur général

  // Propriété pour la validation de l'email
  isValidEmail: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.connectToWebSocket();
    //
    
  }

  // Connexion via WebSocket pour le RFID
  connectToWebSocket(): void {
    this.ws = new WebSocket('ws://localhost:3001');

    this.ws.onmessage = (event) => {
      const uid = event.data;
      console.log(`UID reçu : ${uid}`);
      this.checkUser(uid);
    };

    this.ws.onopen = () => {
      console.log('WebSocket connecté.');
    };

    this.ws.onerror = (error) => {
      console.error('Erreur WebSocket :', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket fermé. Tentative de reconnexion dans 5 secondes...');
      setTimeout(() => this.connectToWebSocket(), 5000);
    };
  }

  // Vérification de l'utilisateur via RFID
  checkUser(uid: string): void {
    fetch('http://localhost:3000/api/check-uid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(`Utilisateur connecté : ${data.role}`);
          this.router.navigate(['/dashboard']);
        } else {
          console.log(data.message);
          this.rfidErrorMessage = data.message;
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la vérification de l’utilisateur :', error);
        this.rfidErrorMessage = 'Une erreur s’est produite. Veuillez réessayer.';
      });
  }

  // Connexion par email et mot de passe
  loginWithEmail(): void {
    this.errorMessage = ''; // Réinitialiser les messages d'erreur
    this.emailInvalid = false; // Réinitialiser l'état de l'email
    this.isValidEmail = true; // Réinitialiser la validation de l'email
  
    // Vérification si les deux champs (email et mot de passe) sont remplis
    if (!this.email || !this.password) {
      this.errorMessage = 'Les deux champs (email et mot de passe) sont obligatoires.';
      return;
    }
  
    // Validation de l'email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.isValidEmail = emailPattern.test(this.email); // Met à jour la validité de l'email
  
    if (!this.isValidEmail) {
      this.errorMessage = 'L\'email que vous avez saisi est invalide.';
      return;
    }
  
  
  
    // Si tout est valide, tenter la connexion
    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.email, password: this.password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          if(data.role === 'admin') {
            console.log(`admin connecté`);
            this.router.navigate(['/dashboard']); // Redirection vers le tableau de bord
          } else if(data.role === 'vigile'){
            console.log(`Vigile connecté`);
            this.router.navigate(['/dashboard-vigile']); // Redirection vers la page des étudiants
          }
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect.';
          console.log(data);
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la connexion :', error);
        this.errorMessage = 'Une erreur s\'est produite. Veuillez réessayer.';
      });
  }
  

  // Méthode pour alterner la visibilité du mot de passe
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Méthode de validation de l'email
  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.isValidEmail = emailPattern.test(this.email);
  }

/*   // Méthode de validation du mot de passe
  validatePassword(): void {
    // Vérifie si le mot de passe contient au moins 8 caractères
    if (this.password.length < 8) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères.';
    } else {
      this.errorMessage = ''; // Réinitialiser l'erreur
    }
  } */
}
