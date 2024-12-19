import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importez RouterModule ici


@Component({
  selector: 'app-listeaprenant',
  standalone: true,
  imports: [SidebarComponent,CommonModule,RouterModule],
  templateUrl: './listeaprenant.component.html',
  styleUrl: './listeaprenant.component.css'
})
export class ListeaprenantComponent {
  learners = [
    { id: 1, name: 'Olivia Rhyne', category: 'SAA Women in Tech', email: 'olivia@example.com' },
    { id: 2, name: 'Phoenix Baker', category: 'SAA Women in Tech', email: 'phoenix@example.com' },
    { id: 3, name: 'Emma Williamson', category: 'SAA Women in Tech', email: 'emma@example.com' },
    { id: 4, name: 'Daniel Craig', category: 'SAA Women in Tech', email: 'daniel@example.com' },
    { id: 5, name: 'Ariana Dugas', category: 'SAA Women in Tech', email: 'ariana@example.com' },
  ];

  // Fonction pour gérer l'upload de fichier
  onFileUpload(event: any) {
    const file = event.target.files[0];
    console.log("Fichier téléchargé:", file);
  }
}
