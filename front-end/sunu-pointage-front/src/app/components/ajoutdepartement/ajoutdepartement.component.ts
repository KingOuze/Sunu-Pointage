import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Importation du Routeur
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ajoutdepartement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SweetAlert2Module],
  templateUrl: './ajoutdepartement.component.html',
  styleUrl: './ajoutdepartement.component.css'
})
export class AjoutdepartementComponent {
  
  name: string | null = null;
  departementForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  
  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute) {
    this.departementForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required]
    })
   }

   ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name !== null) {
          this.name = name; // Assignation seulement si ce n'est pas null
      } else {
          // Gérer le cas où l'ID est null
          console.warn('ID du membre non trouvé');
      }
    });
  }

  onSubmit(): void {
    if (this.departementForm.valid) {
      if(this.name == 'departement') {
        this.userService.createDepartement(this.departementForm.value).subscribe({
          next: (response) => {
            this.successMessage = 'Departement créé avec succès !';
            Swal.fire({
              icon: "success",
              title: "Succès",
              text: "Departement créé avec succès !",
            });
            this.router.navigate(['/departement']); 
          },
          error: (err) => {
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: "Erreur lors de la creation du département",
            });
            console.error(err);
          }
        });
      } 
      else if (this.name == 'cohorte') {
        console.log(this.departementForm.value);
        this.userService.createCohorte(this.departementForm.value).subscribe({
          next: (response) => {
            Swal.fire({
              title: "Succès!",
              text: "Cohorte créé avec succès !",
              icon: "success"
            }); 
            this.router.navigate(['/cohortes']); 
          },
          error: (err) => {
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: err.error.message,
            });

            console.error(err);
          }
        });
      } 
      else {
        this.errorMessage = 'Veuillez remplir correctement le formulaire.';
         Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Veuillez remplir correctement le formulaire.",
        });
      }
    } 
  }

  // Méthode pour revenir à la page des departements
  retourVersListeDepart(): void {
    if (this.name === 'departement') {
      this.router.navigate(['departement']);
    }
    else if (this.name === 'cohorte') {
      this.router.navigate(['cohortes']);
    }
  }
}
