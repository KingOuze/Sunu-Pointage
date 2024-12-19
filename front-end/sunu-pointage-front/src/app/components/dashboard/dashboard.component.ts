import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { AttendanceChartComponent } from '../attendance-chart/attendance-chart.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, StatCardComponent, AttendanceChartComponent, FormsModule],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <div class="content">
        <!-- Barre de recherche en haut du dashboard -->
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Rechercher des données..." 
            [(ngModel)]="searchQuery" 
            class="search-bar" 
            (input)="onSearch()"/>
        </div>

        <!-- Section des statistiques -->
        <div class="stats">
          <!-- Carte pour afficher la date actuelle, placée en premier -->
          <app-stat-card 
            title="Date Actuelle" 
            [value]="currentDate" 
            iconClass="bi-calendar" 
            iconColor="#28a745" 
            class="date-card">
          </app-stat-card>

          <app-stat-card title="Total Employees" value="452" iconClass="bi-people" iconColor="#BF202F"></app-stat-card>
          <app-stat-card title="Total Apprenants" value="360" iconClass="bi-person" iconColor="#BF202F"></app-stat-card>
          <app-stat-card title="Absents" value="50" iconClass="bi-exclamation-circle" iconColor="#BF202F"></app-stat-card>
          <app-stat-card title="Total Retards" value="12" iconClass="bi-clock" iconColor="#BF202F"></app-stat-card>
          <app-stat-card title="Total Pointés" value="50" iconClass="bi-check-circle" iconColor="#BF202F"></app-stat-card>
        </div>

        <!-- Graphique des pointages -->
        <app-attendance-chart></app-attendance-chart>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
    }

    .content {
      flex-grow: 1;
      padding: 20px;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    /* Style pour la carte de la date actuelle */
    .date-card {
      grid-column: span 2; /* Fait en sorte qu'elle occupe deux colonnes */
      background-color: #e9f7ef; /* Couleur de fond différente pour la visibilité */
      border: 2px solid #28a745; /* Bordure pour la mettre en valeur */
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Ombre pour un effet de profondeur */
      font-weight: bold; /* Texte en gras pour la mettre en avant */
    }

    /* Style pour la carte StatCard */
    .stats app-stat-card {
      transition: all 0.3s ease;
    }

    /* Effet de survol pour les cartes */
    .stats app-stat-card:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }

    /* Style pour la barre de recherche */
    .search-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
    }

    .search-bar {
      width: 100%;
      max-width: 600px;
      padding: 12px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  `]
})
export class DashboardComponent {
  searchQuery: string = '';
  currentDate: string = new Date().toLocaleDateString(); // Initialisation de la date actuelle

  // Méthode de gestion de la recherche
  onSearch() {
    console.log("Recherche en cours:", this.searchQuery);
  }
}