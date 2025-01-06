import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Importez RouterModule ici
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-learners',
  standalone:true,
  imports: [SidebarComponent,CommonModule, RouterModule, FormsModule, SweetAlert2Module ],// Ajoutez FormsModule ici],
  templateUrl: './learners.component.html',
  styleUrls: ['./learners.component.css']
})
export class LearnersComponent implements OnInit{

 
  departementId: String = '';
  learners: User[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchQuery: string = ''; // Texte de recherche
  messageService: any;
  message: any;
  selectedFile: File | undefined;


  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
          this.departementId = id; // Assignation seulement si ce n'est pas null
      } else {
          // Gérer le cas où l'ID est null
          console.warn('ID du membre non trouvé');
          this.departementId = ''; // Ou une autre logique
      }
    });
    this.loadUsersByDepartement(this.departementId);
  }

  loadUsersByDepartement(departement: String): void {
    this.userService.getUsersByDepartment(departement).subscribe({
      next: (data) => {
        this.learners = data;
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

  // Filtrer les utilisateurs selon la recherche
  get filteredUsers() {
    if (!this.searchQuery) {
      return this.learners; // Si la recherche est vide, retourner tous les utilisateurs
    }
    const lowerCaseQuery = this.searchQuery.toLowerCase(); // Recherche insensible à la casse
    return this.learners.filter(learner =>
      learner.nom.toLowerCase().includes(lowerCaseQuery) ||
      learner.prenom.toLowerCase().includes(lowerCaseQuery) ||
      learner.email.toLowerCase().includes(lowerCaseQuery)
    );
  }

   // Pagination des utilisateurs filtrés
   get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  deleteUser(id: String): void {
    const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
          },
          buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
          title: "Etes vous sur?",
          text: "Voulez-vous vraiment supprimer cette Utilisateur!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "OUI!",
          cancelButtonText: "No, retour!",
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.userService.deleteUser(id).subscribe({
              next: () => {
                swalWithBootstrapButtons.fire({
                  title: "Supprimé!",
                  text: "Suppression Reussie",
                  icon: "success"
                });
                this.learners = this.learners.filter(learner => learner._id !== id);
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

  //Ajouter un employe
  addEmploye(){
    //Redirection au formulaire d'ajout des employes avec l'id du departement
    this.router.navigate(['/inscription', this.departementId]);  // Redirection vers la route "inscription" avec l'id du departement
  }



  // Fonction pour gérer l'upload de fichier
  onFileUpload(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
        this.selectedFile = input.files[0]; // Récupération du premier fichier
        console.log('Fichier sélectionné:', this.selectedFile); // Vérifiez ici
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);
      

        this.userService.importUsersFromCSV(formData)
            .subscribe({
                next: (response) => {
                  console.log('Fichier importé avec succès', response);
                  Swal.fire({
                    title: "Succès!",
                    text: "Importation Reussie",
                    icon: "success"
                  });
                },
                error: (error) => {
                    console.error('Erreur lors de l\'importation', error);
                    Swal.fire({
                      icon: "error",
                      title: "Erreur",
                      text: "Erreur lors de l\'importation",
                    });
                }
            });
    }
  }


  hasSelected(): boolean {
    return this.learners.some(learner => learner.selected);
}

onDeleteSelected() {
   const selectedIds = this.learners.filter(learner => learner.selected).map(learner => learner._id);
         if (selectedIds.length <= 0) {
         const swalWithBootstrapButtons = Swal.mixin({
           customClass: {
             confirmButton: "btn btn-success",
             cancelButton: "btn btn-danger"
           },
           buttonsStyling: false
         });
         swalWithBootstrapButtons.fire({
           title: "Etes vous sur?",
           text: "Voulez-vous vraiment supprimer cette Utilisateur!",
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
                   icon: "success"
                 });
                 this.loadUsersByDepartement(this.departementId); // Recharge la liste après suppression
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

updateSelection(learner: User) {
    learner.selected = !learner.selected; // Mettez à jour la sélection
}


}