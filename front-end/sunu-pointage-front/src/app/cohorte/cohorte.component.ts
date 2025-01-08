import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cohorte',
  standalone: true,
  imports: [SidebarComponent,CommonModule, RouterModule, SweetAlert2Module],
  templateUrl: './cohorte.component.html',
  styleUrl: './cohorte.component.css'
})
export class CohorteComponent {


  selectedFile: File | null = null;
  cohortes :any[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchQuery: string = '';
  users: any[] = [];
  cohorteCounts: { [key: string]: number } = {};


  constructor(private router: Router, private userService: UserService) { }



  ngOnInit(): void {
    this.getCohortes();
    this.loadUsers();
  }



  getCohortes(): void {
    this.userService.getCohortes().subscribe({
      next: (data) => {
        this.cohortes = data.cohortes;
        this.calculateCohorteCounts(); // Calcul des membres par cohorte
       // console.log(this.cohortes);
      },
      error: (err) => {
         Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Erreur lors du chargement des Cohortes",
          });
        console.error(err);
      }
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe((data) => {
        this.users = data.users;
        this.calculateCohorteCounts();
    });
}

calculateCohorteCounts() {
  this.cohorteCounts = {}; // Réinitialiser les comptes
  this.users.forEach(user => {
      const cohort = user.cohorte; // Assurez-vous que le champ est le même que dans la collection
      if (cohort) {
          this.cohorteCounts[cohort] = (this.cohorteCounts[cohort] || 0) + 1;
      }
  });
  //console.log(this.cohorteCounts);
}

  // Filtrer les utilisateurs selon la recherche
  get filteredCohorte() {
    if (!this.searchQuery) {
      return this.cohortes; // Si la recherche est vide, retourner tous les utilisateurs
    }
    const lowerCaseQuery = this.searchQuery.toLowerCase(); // Recherche insensible à la casse
    return this.cohortes.filter(cohorte =>
      cohorte.nom.toLowerCase().includes(lowerCaseQuery) ||
      cohorte.prenom.toLowerCase().includes(lowerCaseQuery) ||
      cohorte.email.toLowerCase().includes(lowerCaseQuery)
    );
  }

   // Pagination des utilisateurs filtrés
   get paginatedcohortes() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCohorte.slice(startIndex, endIndex);
  }


 

  //redirection de la liste des menbres d'un cohorte
  onItemClick(cohorte: any) {
       // Redirection vers une page spécifique avec l'ID ou un autre paramètre
       this.router.navigate(['/listeaprenant', cohorte._id]);
    }

  // Methode pour supprimer un Cohorte 
  deleteCohorte(id: string): void {
    
    // Vérifier le nombre d'etudiants dans le Cohorte
    this.userService.getEtudiantsCountByCohorte(id).subscribe({
      next: (count) => {
        console.log(count.count);

         if (count.count > 0) {

              // Si le Cohorte a des employés, afficher un message d'erreur
              console.warn(`Le Cohorte ne peut pas être supprimé car il a ${count} etudiants.`);
               Swal.fire({
                  icon: "error",
                  title: "Erreur",
                  text: "Le Cohorte ne peut pas être supprimé car il a ${count} etudiants.",
                });
          } else {
              // Sinon, procéder à la suppression
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success",
                  cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
              });
              swalWithBootstrapButtons.fire({
                title: "Etes vous sur?",
                text: "Voulez-vous vraiment supprimer cette Cohorte!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "OUI!",
                cancelButtonText: "No, retour!",
                reverseButtons: true
              }).then((result) => {
                if (result.isConfirmed) {
                  this.userService.deleteCohorte(id).subscribe({
                    next: () => {
                      swalWithBootstrapButtons.fire({
                        title: "Supprimé!",
                        text: "Suppression Reussie",
                        icon: "success"
                      });
                      this.cohortes = this.cohortes.filter(cohorte => cohorte._id !== id);
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
      },
      error: (err) => {
          console.error('Erreur lors de la vérification des etudiants:', err);
          
          Swal.fire({
            icon: "error",
            title: "Erreur...",
            text: "Erreur lors de la vérification des etudiants",
          });
      }
  });
}


  // Fonction pour gérer l'upload de fichier
  onFileUpload(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
        this.selectedFile = input.files[0]; // Récupération du premier fichier
        console.log('Fichier sélectionné:', this.selectedFile); // Vérifiez ici
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);
      

        this.userService.createCohorteFileUpload(formData)
            .subscribe({
                next: (response) => {
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


    // Filtrer les pointages selon la requête de recherche
    get filteredPointages() {
      return this.cohortes.filter((cohorte) => {
        const searchTerm = this.searchQuery.toLowerCase();
        const nom = cohorte.nom.toLowerCase();
        return (
          nom.includes(searchTerm) 
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
