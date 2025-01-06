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
}
