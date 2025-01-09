import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Importation du Routeur
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SweetAlert2Module], // Importation de la Sidebar
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})

export class InscriptionComponent {

  userForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  departementId: string = '';
  departement: any;
  base64Image: string | null = null;

  
  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute) {
    this.userForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      addresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]],
      fonction: ['', Validators.required],
      role: ['employe'] ,
    })
   }

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
    this.getDepartement(this.departementId);
  }

  getDepartement(id: String): void {
    this.userService.getDepartementById(id).subscribe({
      next: (data) => {
        this.departement = data.departement;
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors du chargement des départements",
          showConfirmButton: false,
          timer: 1500
        });
        console.error(err);
      }
    });
  }

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result as string; // Convertit l'image en Base64
      };
      reader.readAsDataURL(file); // Lire le fichier
    }
  }

  onSubmit(): void {
    
    if (this.userForm.valid && this.base64Image) {
      //asigner le user a son département
      this.userForm.value.departement = this.departementId; 
      this.userForm.value.photo = this.base64Image; // Ajouter l'image en Base64 au user

      this.userService.createUser(this.userForm.value).subscribe({
        next: (response) => {
          Swal.fire({
            title: "Succès!",
            text: "Utilisateur créé avec succès !",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });          
          this.router.navigate(['/learners', this.departementId]); 
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
    } else {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez remplir correctement le formulaire.",
      });
    }
  }
  // Méthode pour revenir à la page des employés
  retourVersListeApprenant(): void {
    this.router.navigate(['/learners', this.departementId]); // Redirection vers la route "learners"
  }
}
