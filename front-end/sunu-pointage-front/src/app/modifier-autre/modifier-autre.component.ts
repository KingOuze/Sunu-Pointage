import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Departement } from '../models/departement';
import { Cohorte } from '../models/cohorte';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from "sweetalert2";

@Component({
  selector: 'app-modifier-autre',
  standalone: true,
  imports: [CommonModule, FormsModule, SweetAlert2Module],
  templateUrl: './modifier-autre.component.html',
  styleUrl: './modifier-autre.component.css'
})
export class ModifierAutreComponent {
  id: any;
  name: String = '';
  departement: Departement = {
    nom: '',
    description: '',
  };

  cohorte : Cohorte = {
    nom: '',
    description: '',
  }
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      const id = params.get('id');
      if (id !== null && name !== null) {
          this.id = id; // Assignation seulement si ce n'est pas null
          this.name = name; // Assignation seulement si ce n'est pas null
          console.log(this.id);
          console.log(this.name);
      } else {
          // Gérer le cas où l'ID est null
          console.warn('ID du membre non trouvé');
      }
    });

    if(this.name == 'departement') {
      this.getDepartementById(this.id);
    } else if(this.name == 'cohorte') {
      this.getCohorteById(this.id);
    }
    
  }


  getDepartementById(id: String){

    this.userService.getDepartementById(id).subscribe({
      next: (data) => {
        this.departement = data.departement;
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

  getCohorteById(id: String){
    this.userService.getCohorteById(id).subscribe({
      next: (data) => {
        this.cohorte = data.cohorte;
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



  onSubmit(): void {
    if(this.name == 'departement') {
     this.userService.updateDepartement(this.id, this.departement).subscribe({
        next: (response) => {
          Swal.fire({
            icon: "success",
            title: "Succès",
            text: "Modification Reussie!",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/departement']); 
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Erreur...",
            text: err.error.message,
          });
          console.error(err);
        }
      });
    } else if(this.name == 'cohorte') {
      this.userService.updateCohorte(this.id, this.cohorte).subscribe({
        next: (response) => {
          Swal.fire({
            icon: "success",
            title: "Succès",
            text: "Modification Reussie!",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/cohortes']); 
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Erreur...",
            text: err.error.message,
          });
          console.error(err);
        }
      });
    } 
    
  }
  
  // Méthode pour revenir à la page des employés
  retourVersListe(): void {
    if(this.name == 'departement') {
      this.router.navigate(['departement']);
    } else if(this.name == 'cohorte') {
      this.router.navigate(['cohortes']);
    }
  }

  

}
