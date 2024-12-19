import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importation du Routeur
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-apprenant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apprenant.component.html',
  styleUrl: './apprenant.component.css'
})
export class ApprenantComponent {

  constructor(private router: Router) { }

  // Méthode pour revenir à la page des employés
  retourVersListeEmployes(): void {
    this.router.navigate(['/listeaprenant']); // Redirection vers la route "learners"
  }

}
