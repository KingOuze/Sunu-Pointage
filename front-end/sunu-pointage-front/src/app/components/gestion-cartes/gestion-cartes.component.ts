import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importez RouterModule ici

@Component({
  selector: 'app-gestion-cartes',
  standalone: true,
  imports: [SidebarComponent,CommonModule,RouterModule],
  templateUrl: './gestion-cartes.component.html',
  styleUrl: './gestion-cartes.component.css'
})
export class GestionCartesComponent {

  membres = [
    {
      nom: 'Olivia Rhye',
      etat: 'Active',
      fonction: 'Employé',
      email: 'olivia@untitledui.com',
    },
    {
      nom: 'Phoenix Baker',
      etat: 'Active',
      fonction: 'Apprenant',
      email: 'phoenix@untitledui.com',
    },
    {
      nom: 'Lana Steiner',
      etat: 'Inactive',
      fonction: 'Apprenant',
      email: 'lana@untitledui.com',
    },
    {
      nom: 'Demi Wilkinson',
      etat: 'Active',
      fonction: 'Employé',
      email: 'demi@untitledui.com',
    },
    {
      nom: 'Candice Craig',
      etat: 'Active',
      fonction: 'Employé',
      email: 'candice@untitledui.com',
    },
  ];
}
