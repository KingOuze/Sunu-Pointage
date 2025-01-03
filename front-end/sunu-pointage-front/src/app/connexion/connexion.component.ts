import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  standalone: true,
  imports: [FormsModule,CommonModule],
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  email: string = '';
  password: string = '';
  isPasswordVisible: boolean = false;
  errorMessage: string = ''; // Message d'erreur pour la connexion
  emailInvalid: boolean = false; // Indicateur si l'email est invalide
  passwordInvalid: boolean = false; // Indicateur si le mot de passe est invalide
  passwordMismatch: boolean = false; // Indicateur si le mot de passe ne correspond pas à l'email

  constructor(private authService: AuthService, private router: Router) { }

  // Méthode pour gérer l'affichage du mot de passe
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Méthode pour gérer la connexion avec email et mot de passe
  onLogin(event: Event) {
    event.preventDefault(); // Empêche le rechargement de la page
  
    // Réinitialisation des indicateurs et du message d'erreur
    this.emailInvalid = false;
    this.passwordInvalid = false;
    this.errorMessage = '';
  
    // Vérification si les champs sont vides
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = "Les deux champs doivent être remplis.";
      return;
    }
  
    // Vérification de la validité de l'email
    if (!this.isValidEmail(this.email)) {
      this.emailInvalid = true;
      this.errorMessage = "L'email ou le mot de passe est invalide.";
      return;
    }
  
    // Vérification de la longueur du mot de passe
    if (this.password.length < 6) {
      this.passwordInvalid = true;
      this.errorMessage = "L'email ou le mot de passe est invalide.";
      return;
    }
  
    // Tentative de connexion
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Connexion réussie', response);
        this.errorMessage = ''; // Réinitialiser le message d'erreur
  
        // Redirection selon le rôle de l'utilisateur
        if (response.role) {
          if (response.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (response.role === 'vigile') {
            this.router.navigate(['/dashboard-vigile']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          console.error('Rôle non trouvé dans la réponse');
          this.errorMessage = "Erreur: rôle introuvable.";
        }
      },
      error: (err) => {
        console.error('Échec de la connexion', err);
        if (err.status === 401) {
          // Message si les informations fournies sont incorrectes
          this.errorMessage = "L'email ou le mot de passe est invalide.";
        }
      }
    });
  }
  
  

  // Fonction pour vérifier si l'email est valide
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  // Méthode pour vérifier si le mot de passe correspond à l'email (en temps réel)
  checkPasswordMismatch(email: string, password: string) {
    this.authService.checkPassword(email, password).subscribe({
      next: (response) => {
        // Si la réponse indique que le mot de passe ne correspond pas
        if (response && response.valid === false) {
          this.passwordMismatch = true;
        } else {
          this.passwordMismatch = false;
        }
      },
      error: (err) => {
        console.error('Erreur lors de la vérification du mot de passe', err);
        this.passwordMismatch = false;
      }
    });
  }

  // Méthode pour gérer la connexion via l'UID de la carte RFID
  onCardLogin() {
    const uid = 'D3A5D22E'; // Simuler un UID de carte RFID

    this.authService.loginWithUID(uid).subscribe({
      next: (response) => {
        console.log('Connexion RFID réussie', response);

        if (response.role) {
          // Redirection selon le rôle
          if (response.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (response.role === 'vigile') {
            this.router.navigate(['/dashboard-vigile']);
          } else {
            this.router.navigate(['/dashboard']); // Redirection par défaut
          }
        } else {
          console.error('Rôle non trouvé dans la réponse');
          this.errorMessage = "Erreur: rôle introuvable.";
        }
      },
      error: (err) => {
        console.error('Échec de la connexion via la carte RFID', err);
        this.errorMessage = "Erreur lors de la connexion avec la carte RFID.";
      }
    });
  }
}
