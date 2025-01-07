import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importez RouterModule ici
import { UserService } from '../services/user.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-list-admin-vigile',
  standalone: true,
  imports: [ SidebarComponent, CommonModule, RouterModule, SweetAlert2Module, FormsModule, NgxPaginationModule], 
  templateUrl: './list-admin-vigile.component.html',
  styleUrl: './list-admin-vigile.component.css'
})
export class ListAdminVigileComponent implements OnInit{


  users: any[] = [];
  errorMessage: string = '';
  searchQuery: string = '';
  filteredUsers: any[] = [];
  searchText: string = ''; // Texte de recherche
  itemsPerPage: number = 5; // Nombre d'éléments par page
  currentPage: number = 1; // Page actuelle

  

  constructor(private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    
    this.loadUsers();

     // Initialiser filteredUsers avec la liste complète
     this.filteredUsers = [...this.users]
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.users;
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors du chargement des utilisateurs",
        });
        console.error(err);
      }
    });
  }

  deleteUser(id: string): void {
    Swal.fire({
      title: 'Etes-vous sur?',
      text: "Cette action supprimera cette utilisateur.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if(result){
        this.userService.deleteUser(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Supprimé!',
              text: 'L\'utilisateur a été supprimé avec succès.',
              showConfirmButton: false,
              timer: 1500
          });
          this.loadUsers();
  
        }, error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la suppression de l\'Utilisateur',
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
      }
  
    })
 }

 addUser() {
    this.router.navigate(['/ajouter']); // Redirection vers la route "ajoutadmin"
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchValue = input.value; // Type 'string'
    console.log('Valeur recherchée :', searchValue);
    this.searchText = searchValue; // Mettre à jour votre variable de recherche
    this.filterUsers(); // Appeler la méthode pour filtrer la liste
  }

  changePage(page: number): void {
    this.currentPage = page; // Mettre à jour la page actuelle
    this.filterUsers(); // Appeler la méthode pour filtrer la liste
  }
  filterUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      Object.values(user).some((value: any) =>
        value?.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }
  
}
