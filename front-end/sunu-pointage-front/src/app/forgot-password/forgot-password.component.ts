// forgot-password.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone:true,
  imports:[FormsModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private http: HttpClient,private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:5000/api/auth/forgot-password', { email: this.email })
      .subscribe({
        next: () => {
          alert('Un email de réinitialisation a été envoyé si l\'email existe');
          // Redirection vers le composant de réinitialisation du mot de passe
          this.router.navigate(['/reset-password']);
        },
        error: (err) => {
          console.error('Erreur lors de l\'envoi de l\'email', err);
        }
      });
  }
}