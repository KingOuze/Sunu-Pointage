import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importez RouterModule ici


@Component({
  selector: 'app-departement',
  standalone: true,
  imports: [SidebarComponent,CommonModule, RouterModule],
  templateUrl: './departement.component.html',
  styleUrl: './departement.component.css'
})
export class DepartementComponent {
  learners = [
    { id: 1, name: 'Olivia Rhyne', departement: 'SAA Women in Tech', membres: 'oliviaexample' },
    { id: 2, name: 'Phoenix Baker', departement: 'SAA Women in Tech', membres: 'phoenixexample' },
    { id: 3, name: 'Emma Williamson', departement: 'SAA Women in Tech', membres: 'emmaexample' },
    { id: 4, name: 'Daniel Craig', departement: 'SAA Women in Tech', membres: 'danielexample' },
    { id: 5, name: 'Ariana Dugas', departement: 'SAA Women in Tech', membres: 'arianaexample' },
  ];

  // Fonction pour gérer l'upload de fichier
  onFileUpload(event: any) {
    const file = event.target.files[0];
    console.log("Fichier téléchargé:", file);
  }
}
