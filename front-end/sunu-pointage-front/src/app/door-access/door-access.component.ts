import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-door-access',
  standalone: true,
  imports: [CommonModule], // Retirez NgModule de cette liste
  templateUrl: './door-access.component.html',
  styleUrls: ['./door-access.component.css']
})
export class DoorAccessComponent {
  // État de la porte : ouverte (true) ou fermée (false)
  isDoorOpen: boolean = false;

  // Méthode pour basculer l'état de la porte
  toggleDoor(): void {
    this.isDoorOpen = !this.isDoorOpen;
  }
}