import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importation du Routeur
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-ajout-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SweetAlert2Module],
  templateUrl: './ajout-admin.component.html',
  styleUrl: './ajout-admin.component.css'
})
export class AjoutAdminComponent {

  
  userForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  base64Image: string | null = null;

  constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private userService: UserService) {
    this.userForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(9)]],
      addresse: ['', Validators.required],
      role: ['', Validators.required],
    })
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
      this.userForm.value.photo = this.base64Image; // Ajouter l'image en Base64 au user
      console.log(this.userForm.value);

      this.userService.createUser(this.userForm.value).subscribe({
        next: (response) => {
          Swal.fire({
            title: "Succès!",
            text: "Utilisateur créé avec succès !",
            icon: "success"
          });
          this.router.navigate(['/liste']); 
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Erreur lors de la création de l\'utilisateur.",
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
    this.router.navigate(['/liste']); // Redirection vers la route "listeaprenant"
  }
}
