import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { PointageService } from '../../services/pointage.service';

@Component({
  selector: 'app-attendance-list',
  standalone:true,
  imports:[CommonModule,SidebarComponent,FormsModule],
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent {
  searchQuery: string = '';
  selectedDate: string = '';

  pointages: any[] = []; // Stockera les données des pointages
  loading: boolean = true; // Indicateur de chargement
  error: string | null = null; // Stockera les erreurs éventuelles

  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 5; // Nombre d'éléments par page
  
  donnees: any = {};

  constructor(private pointageService: PointageService) {
   
  }


  ngOnInit(): void {
    this.fetchPointages(); // Appeler la méthode pour charger les pointages au démarrage
  }

  fetchPointages(): void {
    this.loading = true;
    this.pointageService.getAllPointages().then(
      (data) => {
        this.pointages = data.historique || []; // Assurez-vous que la clé correspond à votre réponse
        this.loading = false;
        console.log(this.pointages); //
      },
      (error) => {
        console.error('Erreur lors du chargement des pointages:', error);
        this.error = 'Impossible de charger les données des pointages.';
        this.loading = false;
      }
    );
  }
  searchAttendance(): void {
    this.pointages = this.pointages.filter(
      (pointage) => pointage.date === this.selectedDate
    );
  }
  

   // Filtrer les pointages selon la requête de recherche
   get filteredPointages() {
    return this.pointages.filter((pointage) => {
      const searchTerm = this.searchQuery.toLowerCase();
      const matricule = pointage.user_id.matricule.toLowerCase();
      const nom = pointage.user_id.nom.toLowerCase();
      const prenom = pointage.user_id.prenom.toLowerCase();
      const date = pointage.date.toLowerCase();
      return (
        matricule.includes(searchTerm) ||
        nom.includes(searchTerm) ||
        prenom.includes(searchTerm) ||
        date.includes(searchTerm)
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
