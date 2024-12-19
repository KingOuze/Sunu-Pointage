import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importation du Routeur

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule], // Importation de la Sidebar
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})

export class InscriptionComponent {

  constructor(private router: Router) { }

  // Méthode pour revenir à la page des employés
  retourVersListeEmployes(): void {
    this.router.navigate(['/learners']); // Redirection vers la route "learners"
  }
}
