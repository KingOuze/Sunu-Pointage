import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importez RouterModule ici
import { UserService } from '../../services/user.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-departement',
  standalone: true,
  imports: [SidebarComponent,CommonModule, RouterModule, SweetAlert2Module],
  templateUrl: './departement.component.html',
  styleUrl: './departement.component.css'
})
export class DepartementComponent {

  selectedFile: File | null = null;
  departements :any[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchQuery: string = '';
  users: any[] = [];
  departmentCounts: { [key: string]: number } = {};


  constructor(private router: Router, private userService: UserService) { }



  ngOnInit(): void {
    this.getDepartements();
    this.loadUsers();
  }



  getDepartements(): void {
    this.userService.getDepartements().subscribe({
      next: (data) => {
        this.departements = data.departements;
        this.calculateDepartmentCounts(); // Calcul des membres par département
       // console.log(this.departements);
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

  loadUsers() {
    this.userService.getAllUsers().subscribe((data) => {
        this.users = data.users;
        this.calculateDepartmentCounts();
    });
}

calculateDepartmentCounts() {
  this.departmentCounts = {}; // Réinitialiser les comptes
  this.users.forEach(user => {
      const dept = user.departement; // Assurez-vous que le champ est le même que dans la collection
      if (dept) {
          this.departmentCounts[dept] = (this.departmentCounts[dept] || 0) + 1;
      }
  });
  //console.log(this.departmentCounts);
}

  // Filtrer les utilisateurs selon la recherche
  get filteredDepartement() {
    if (!this.searchQuery) {
      return this.departements; // Si la recherche est vide, retourner tous les utilisateurs
    }
    const lowerCaseQuery = this.searchQuery.toLowerCase(); // Recherche insensible à la casse
    return this.departements.filter(departement =>
      departement.nom.toLowerCase().includes(lowerCaseQuery) ||
      departement.prenom.toLowerCase().includes(lowerCaseQuery) ||
      departement.email.toLowerCase().includes(lowerCaseQuery)
    );
  }

   // Pagination des utilisateurs filtrés
   get paginatedDepartements() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDepartement.slice(startIndex, endIndex);
  }


  //redirection de la liste des menbres d'un departement
  onItemClick(departement: any) {
       // Redirection vers une page spécifique avec l'ID ou un autre paramètre
       this.router.navigate(['/learners', departement._id]);
    }

  // Methode pour supprimer un département 
  deleteDepartement(id: string): void {
    
    // Vérifier le nombre d'employés dans le département
    this.userService.getEmployeesCountByDepartment(id).subscribe({
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
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });
          swalWithBootstrapButtons.fire({
            title: "Etes vous sur?",
            text: "Voulez-vous vraiment supprimer cette Departement!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "OUI",
            cancelButtonText: "No, retour!",
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.userService.deleteDepartement(id).subscribe({
                next: () => {
                  swalWithBootstrapButtons.fire({
                    title: "Supprimé!",
                    text: "Suppression Reussie",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                  });
                  this.departements = this.departements.filter(departement => departement._id !== id);
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
            } else {
              // Si le département a des employés, afficher un message d'erreur
              Swal.fire({
                icon: "error",
                title: "Erreur...",
                text: "Erreur lors de la suppression!",
              });
            }
          });
        }
      }
  });
}

  // Ajouter un département
  addDepartment(): void {
    this.router.navigate(['/ajoutdepartement']); // Redirection vers la route "ajoutdepartement"
  }

  // Modifier un département
  modifyDepartment(id: String): void {
    this.router.navigate(['/modificationdepartement', id]); // Redirection vers la route "modificationdepartement" avec l'id du département
  }

  // Modifier un employé

  // Fonction pour gérer l'upload de fichier
  onFileUpload(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
        this.selectedFile = input.files[0]; // Récupération du premier fichier
        console.log('Fichier sélectionné:', this.selectedFile); // Vérifiez ici
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);
      

        this.userService.createDepartementFileUpload(formData)
            .subscribe({
                next: (response) => {
                    Swal.fire({
                      title: "Succès!",
                      text: "Importation Reussie",
                      icon: "success"
                    });
                    console.log('Fichier importé avec succès', response);
                },
                error: (error) => {
                    Swal.fire({
                      icon: "error",
                      title: "Erreur",
                      text: "Erreur lors de l\'importation",
                    });                   
                    console.error('Erreur lors de l\'importation', error);
                }
            });
    }
}


    // Filtrer les pointages selon la requête de recherche
    get filteredPointages() {
      return this.departements.filter((departement) => {
        const searchTerm = this.searchQuery.toLowerCase();
        const nom = departement.nom.toLowerCase();
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
