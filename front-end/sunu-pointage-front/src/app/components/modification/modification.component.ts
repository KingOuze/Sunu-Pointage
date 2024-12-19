import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modification',
  standalone: true,
  imports: [],
  templateUrl: './modification.component.html',
  styleUrl: './modification.component.css'
})
export class ModificationComponent {
  constructor(private router: Router) { }

  // Méthode pour revenir à la page des employés
  retourVersListeEmployes(): void {
    this.router.navigate(['/learners']); // Redirection vers la route "learners"
  }

}
