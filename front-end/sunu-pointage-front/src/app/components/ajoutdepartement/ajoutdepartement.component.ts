import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importation du Routeur


@Component({
  selector: 'app-ajoutdepartement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ajoutdepartement.component.html',
  styleUrl: './ajoutdepartement.component.css'
})
export class AjoutdepartementComponent {
  constructor(private router: Router) { }

  // Méthode pour revenir à la page des employés
  retourVersListeEmployes(): void {
    this.router.navigate(['/learners']); // Redirection vers la route "learners"
  }
}
