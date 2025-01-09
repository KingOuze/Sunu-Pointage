import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { AttendanceChartComponent } from '../attendance-chart/attendance-chart.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { UserFilterService } from '../../services/user-filter.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, StatCardComponent, AttendanceChartComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  searchQuery: string = '';
  currentDate: string = new Date().toLocaleDateString(); // Initialisation de la date actuelle
  countEmployes: number = 0;
  countEtudiant: number = 0;



  constructor(private userService: UserService, private userFilterService: UserFilterService) {}

  ngOnInit(){
    this.countEmployees();
    this.countEtudiants();
  }
  
  countEmployees() {
    this.userService.getUsersByRole('employe').subscribe({
      next:(response) => {
        this.countEmployes = response.users.length;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération du nombre d\'employés'
        })
        console.error(err);
      }
    });
  }

  countEtudiants() {
    this.userService.getUsersByRole('etudiant').subscribe({
      next:(result) => {
        this.countEtudiant = result.users.length;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération du nombre d\'etudiants'
        })
        console.error(err);
      }
    });
  }

  
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      console.log('Valeur saisie :', input.value);
      this.userFilterService.updateSearchTerm(input.value);
    }
  }

 
}