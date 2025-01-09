import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importez RouterModule ici
import { UserService } from '../services/user.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-list-admin-vigile',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    RouterModule,
    SweetAlert2Module,
    FormsModule,
    
  ],
  templateUrl: './list-admin-vigile.component.html',
  styleUrl: './list-admin-vigile.component.css',
})
export class ListAdminVigileComponent implements OnInit{


  users: any[] = [];
  errorMessage: string = '';
  searchQuery: string | null = null;
  selectedDate: string = '';
  currentPage: number = 3; // Page actuelle
  itemsPerPage: number = 7; // Nombre d'éléments par page
 

  constructor(private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    
    this.loadUsers();

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
      if(result.isConfirmed){
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


     hasSelected(): boolean {
       return this.users.some(user => user.selected);
   }
   
   onDeleteSelected() {
       const selectedIds = this.users.filter(user => user.selected).map(user => user._id);
       if (selectedIds.length > 0) {
       const swalWithBootstrapButtons = Swal.mixin({
         customClass: {
           confirmButton: "btn btn-success",
           cancelButton: "btn btn-danger"
         },
         buttonsStyling: false
       });
       swalWithBootstrapButtons.fire({
         title: "Etes vous sur?",
         text: "Voulez-vous vraiment supprimer ces Utilisateurs!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonText: "OUI!",
         cancelButtonText: "No, retour!",
         reverseButtons: true
       }).then((result) => {
         if (result.isConfirmed) {
           this.userService.deleteMultipleUsers(selectedIds).subscribe({
             next: (response) => {
             
               Swal.fire({
                 title: "Supprimé!",
                 text: "Suppression Reussie",
                 icon: "success",
                 showConfirmButton: false,
                 timer: 1500
               });
               this.loadUsers(); // Recharge la liste après suppression
             },
             error: (err) => {
               Swal.fire({
                 icon: "error",
                 title: "Erreur...",
                 text: "Erreur lors de la suppression!",
               });
               console.error(err);
             }
           });
          
         }
       });      
           
      } 
   }
   
   updateSelection(user: any) {
       user.selected = !user.selected; // Mettez à jour la sélection
   }

 addUser() {
    this.router.navigate(['/ajouter']); // Redirection vers la route "ajoutadmin"
  }


    // Filtrer les pointages selon la requête de recherche
  get filteredPointages() {
    if (!this.searchQuery) return this.users; // Si aucune recherche, renvoyer tous les pointages
    else {
      return this.users.filter((user) => {
        const searchTerm = this.searchQuery!.toLowerCase();
        const matricule = user.matricule.toLowerCase();
        const nom = user.nom.toLowerCase();
        const prenom = user.prenom.toLowerCase();
        const email = user.email.toLowerCase();
        return (
          matricule.includes(searchTerm) ||
          nom.includes(searchTerm) ||
          prenom.includes(searchTerm) ||
          email.includes(searchTerm)
        );
      }); 
    }
  }

   // Calculer les pointages à afficher pour la page actuelle
   get paginatedPointages() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPointages.slice(startIndex, endIndex);
  }

  /// Total de pages
  totalPages(): number {
    return Math.ceil(this.filteredPointages.length / this.itemsPerPage);
  }

  // Passer à la page suivante
  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  // Passer à la page précédente
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Aller directement à la page
  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }


}
