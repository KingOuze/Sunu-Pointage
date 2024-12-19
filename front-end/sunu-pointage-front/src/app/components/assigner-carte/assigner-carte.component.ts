import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assigner-carte',
  templateUrl: './assigner-carte.component.html',
  styleUrls: ['./assigner-carte.component.css'],
})
export class AssignerCarteComponent {
  constructor(private router: Router) {}

  // Méthode pour gérer le retour
  goBack(): void {
    this.router.navigate(['/gestion-cartes']);
  }
}
