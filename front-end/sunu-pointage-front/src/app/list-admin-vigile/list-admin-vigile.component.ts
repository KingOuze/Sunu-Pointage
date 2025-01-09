import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; // Importation de ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Importer CommonModule pour *ngFor
import { SidebarComponent } from '../components/sidebar/sidebar.component';

// Déclaration des modèles pour les données à afficher
interface User {
  id: number;
  nom: string | null;
  email: string;
  role: string;
}

@Component({
  selector: 'app-list-admin-vigile',
  standalone: true,
  imports: [
    SidebarComponent,
    NgbPaginationModule,  // Utiliser le module pour la pagination
    ReactiveFormsModule,   // Ajouter ReactiveFormsModule ici
    CommonModule,          // Ajouter CommonModule ici pour *ngFor
  ],
  templateUrl: './list-admin-vigile.component.html',
  styleUrls: ['./list-admin-vigile.component.css'],
})
export class ListAdminVigileComponent implements OnInit {

  users: User[] = [];  // Tableau local pour stocker les utilisateurs
  filteredUsers: User[] = [];  // Utilisateurs après filtrage
  searchControl = new FormControl('');  // Contrôle de recherche
  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();  // Charger les utilisateurs dès l'initialisation

    // Lancer une recherche dès que l'utilisateur saisit quelque chose
    this.searchControl.valueChanges.subscribe(value => {
      this.filterUsers(value);  // Filtrer les utilisateurs dès que la recherche change
    });
  }

  // Charger tous les utilisateurs (initialement ou après la pagination)
  loadUsers() {
    this.userService.getAllUsers().subscribe(response => {
      console.log(response);  // Afficher la réponse pour vérifier sa structure
      const users = response.users;  // Accéder à la clé 'users' dans la réponse
      this.users = users;  // Stocker tous les utilisateurs
      this.totalUsers = users.length;  // Nombre total d'utilisateurs
      this.filterUsers('');  // Appliquer un filtre vide pour afficher tous les utilisateurs
    });
  }

  // Filtrer les utilisateurs en fonction du terme de recherche
  filterUsers(searchTerm: any) {
    // Filtrer les utilisateurs sur la base du terme de recherche
    this.filteredUsers = this.users.filter(user =>
      (user.nom || '').toLowerCase().includes(searchTerm.toLowerCase())  // Utilisation d'une valeur par défaut (chaîne vide)
    );
    // Réinitialiser la page à 1 à chaque fois que la recherche change
    this.currentPage = 1;
    // Appliquer la pagination après filtrage
    this.updateFilteredUsers();
  }

  // Mettre à jour la liste des utilisateurs filtrés en fonction de la pagination
  updateFilteredUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const paginatedUsers = this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
    this.filteredUsers = paginatedUsers;  // Appliquer la pagination sur les utilisateurs filtrés
  }

  // Gérer le changement de page
  onPageChange(page: number) {
    this.currentPage = page;  // Mettre à jour la page actuelle
    this.updateFilteredUsers();  // Mettre à jour les utilisateurs affichés pour la page actuelle
  }
}
