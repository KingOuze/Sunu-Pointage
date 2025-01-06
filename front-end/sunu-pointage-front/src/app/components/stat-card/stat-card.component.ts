import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <i class="bi" [ngClass]="iconClass" [ngStyle]="{'color': iconColor}"></i>
      <div class="card-content">
        <h4>{{ title }}</h4>
        <p>{{ value }}</p>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
      width: 250px; /* Taille fixe */
      height: 150px; /* Hauteur fixe */
      text-align: center;
    }

    .stat-card i {
      font-size: 2.5rem; /* Taille des icônes */
    }

    .stat-card h4 {
      margin: 0;
      font-size: 1.1rem;
      color: #495057;
    }

    .stat-card p {
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `]
})
export class StatCardComponent {
  @Input() title!: string;
  @Input() value!: string;
  @Input() iconClass!: string; // Classe d'icône Bootstrap
  @Input() iconColor: string = '#BF202F'; // Couleur des icônes

  
}
 

