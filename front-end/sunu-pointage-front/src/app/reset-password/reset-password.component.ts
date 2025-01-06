import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports:[FormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  token: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Récupérer le token de l'URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit() {
    this.http.post('http://localhost:5000/api/auth/reset-password', { 
      token: this.token, 
      newPassword: this.newPassword 
    })
    .subscribe({
      next: () => {
        alert('Mot de passe réinitialisé avec succès');
        // Rediriger vers une autre page si nécessaire
      },
      error: (err) => {
        console.error('Erreur lors de la réinitialisation du mot de passe', err);
      }
    });
  }
}