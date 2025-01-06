import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importez RouterModule ici
import { UserService } from '../../services/user.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-cartes',
  standalone: true,
  imports: [SidebarComponent,CommonModule,RouterModule, SweetAlert2Module],
  templateUrl: './gestion-cartes.component.html',
  styleUrl: './gestion-cartes.component.css'
})
export class GestionCartesComponent {

  users: any[] = [];
  errorMessage: string = '';

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
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
      }
  
    })
 }
}
