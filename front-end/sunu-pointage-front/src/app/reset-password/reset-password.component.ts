import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  message: string = '';
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Récupérer le jeton de l'URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit() {
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.message = response.message; // Message de succès
        this.error = ''; // Réinitialiser les erreurs
      },
      error: (err) => {
        this.error = err.error.message; // Message d'erreur
        this.message = ''; // Réinitialiser les messages de succès
      },
    });
  }
}
