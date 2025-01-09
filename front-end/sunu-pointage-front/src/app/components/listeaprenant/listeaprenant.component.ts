import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Importez RouterModule ici
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from "sweetalert2";

@Component({
  selector: 'app-listeaprenant',
  standalone: true,
  imports: [SidebarComponent,CommonModule,RouterModule, FormsModule, SweetAlert2Module],
  templateUrl: './listeaprenant.component.html',
  styleUrl: './listeaprenant.component.css',
})
export class ListeaprenantComponent {
  
  searchQuery: string = '';
  selectedDate: string = '';
  cohorteId: string = '';
  learners: User[] = [];
  selectedFile: File | undefined;
 
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 5; // Nombre d'éléments par page
 
  
  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
          this.cohorteId = id; // Assignation seulement si ce n'est pas null
          
      } else {
          // Gérer le cas où l'ID est null
          console.warn('ID du membre non trouvé');
          this.cohorteId = ''; // Ou une autre logique
      }
    });
    this.loadUsersByCohorte(this.cohorteId);

    /*this.userFilterService.searchTerm$.subscribe((term) => {
      this.filteredUsers = this.learners.filter((learner) =>
        learner.nom.toLowerCase().includes(term.toLowerCase())
      );
    });*/
  }

  loadUsersByCohorte(cohorteId: String): void {
    this.userService.getUsersByCohorte(cohorteId).subscribe({
      next: (data) => {
        this.learners = data;
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
    this.router.navigate(['/inscription', this.cohorteId]);  // Redirection vers la route "inscription" avec l'id du departement
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
                    Swal.fire({
                      title: "Succès!",
                      text: "Importation Reussie",
                      icon: "success"
                    });
                  },
                  error: (error) => {
                    Swal.fire({
                      title: "Erreur!",
                      text: "Erreur lors de l'importation",
                      icon: "error"
                    });
                      console.error('Erreur lors de l\'importation', error);
                  }
              });
      }
    }

    hasSelected(): boolean {
      return this.learners.some(learner => learner.selected);
  }
  
  onDeleteSelected() {
    console.log('Deleting selected');
      const selectedIds = this.learners.filter(learner => learner.selected).map(learner => learner._id);
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
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              });
              this.loadUsersByCohorte(this.cohorteId); // Recharge la liste après suppression
            },
            error: (err) => {
              Swal.fire({
                icon: "error",
                title: "Erreur...",
                text: err.message,
                showConfirmButton: false,
                timer: 1500
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

   
      // Filtrer les pointages selon la requête de recherche
      get filteredPointages() {
        return this.learners.filter((learner) => {
          const searchTerm = this.searchQuery.toLowerCase();
          const matricule = learner.matricule?.toLowerCase();
          const nom = learner.nom.toLowerCase();
          const prenom = learner.prenom.toLowerCase();
          const email = learner.email.toLowerCase();
          return (
            matricule?.includes(searchTerm) ||
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
