import {  Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importez RouterModule ici
import { UserService } from '../../services/user.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-cartes',
  standalone: true,
  imports: [SidebarComponent,CommonModule,RouterModule, SweetAlert2Module, FormsModule],
  templateUrl: './gestion-cartes.component.html',
  styleUrl: './gestion-cartes.component.css'
})
export class GestionCartesComponent implements OnInit {


  @Input() selectedUser: any;  // Reçoit l'utilisateur sélectionné
  @Output() closeModalEvent = new EventEmitter<void>();  // Émet un événement pour fermer le modal


 
  isModalOpen = false;
  searchQuery: string = '';
  selectedDate: string = '';
  users: any[] = [];
  errorMessage: string = '';
  donnees: any | null = null;
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 5; // Nombre d'éléments par page

  constructor(private userService: UserService) {}
 
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

  deleteAssign(id: string): void {
    Swal.fire({
      title: 'Etes-vous sur?',
      text: "Cette action supprimera la carte assignée à ce dernier.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if(result){
        this.userService.deleteCard(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Supprimé!',
              text: 'L\'assignation de la carte a été supprimé avec succès.',
              showConfirmButton: false,
              timer: 1500
          });
          this.loadUsers();
  
        }, error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la suppression de la carte',
          });
        }
      })
      }
  
    })
 }

 switchStatus(id: String, status: String): void {
   this.userService.switchStatus(id, status).subscribe({
     next: (res) => {
       Swal.fire({
         icon:'success',
         title: 'Changement effectué!',
         text: 'La carte a été changée avec succès.',
         showConfirmButton: false,
         timer: 1500
     });
     this.loadUsers();
     },
     error: (err) => {  
       console.error(err);
       Swal.fire({
         icon: 'error',
         title: 'Erreur',
         text: 'Erreur lors du changement de la carte',
       });
      }
 })
}

getDepartementById(id: String){
  this.userService.getDepartementById(id).subscribe({
    next: (data) => {
      this.donnees = data.departement;
      console.log(this.donnees)
    },
    error: (err) => {
      console.error(err);
    }
  });
}

getCohortsById(id:String){
  this.userService.getCohortById(id).subscribe({
    next: (data) => {
      this.donnees = data.cohorte;
      console.log(this.donnees)
    },
    error: (err) => {
      console.error(err);
    }
  });
}

 // Ouvre le modal
 openModal(user: any) {
  this.selectedUser = user;
  if(this.selectedUser.role === 'employe'){
    this.getDepartementById(user.departement);
  } else if(this.selectedUser.role === 'etudiant'){
    this.getCohortsById(user.cohorte);
  }
  
  this.isModalOpen = true;
}

// Ferme le modal
closeModal() {
  this.isModalOpen = false;
  this.selectedUser = null;  // Déselectionne l'utilisateur sélectionné
  this.closeModalEvent.emit();  // Émet un événement pour informer le parent que le modal a été fermé
}
    


     // Filtrer les pointages selon la requête de recherche
     get filteredPointages() {
      return this.users.filter((user) => {
        const searchTerm = this.searchQuery.toLowerCase();
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
  
     // Calculer les pointages à afficher pour la page actuelle
     get paginatedPointages() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredPointages.slice(startIndex, endIndex);
    }
  
    // Total de pages
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
