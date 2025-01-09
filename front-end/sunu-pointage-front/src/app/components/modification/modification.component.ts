import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { FormBuilder, FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from "sweetalert2";

@Component({
  selector: 'app-modification',
  standalone: true,
  imports: [CommonModule, FormsModule, SweetAlert2Module],
  templateUrl: './modification.component.html',
  styleUrl: './modification.component.css'
})
export class ModificationComponent {
  userId: string = '';
  //user: any ;
  errorMessage: string = '';
  donnees: any;
  name: String = '';

  user: User = {
    _id:'',
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    addresse: '',
    role: '',
  };
  successMessage: string = '';
  base64Image: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      const id = params.get('id');

      if (id !== null && name !== null) {
          this.userId = id; // Assignation seulement si ce n'est pas null
          this.name = name; // Assignation seulement si ce n'est pas null
          this.getUserById(this.userId);
      
      } else {
          // Gérer le cas où l'ID est null
          console.warn('ID du membre non trouvé');
          this.userId = ''; // Ou une autre logique
      }
    });

    this.getDonneesDepartement(this.name);
    this.getDonneesCohort(this.name);
    
  }

 

  getUserById(id: String): void {
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data.user;
        
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

  getDonneesDepartement(id: String){
    this.userService.getDepartements().subscribe({
      next: (data) => {
        this.donnees = data.departements;
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

  getDonneesCohort(id: String){
    this.userService.getCohortes().subscribe({
      next: (data) => {
        this.donnees = data.cohortes;
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors du chargement des cohortes",
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

    console.log(this.user.cohorte);
    console.log(this.user.departement);
    console.log(this.user);
    if(this.base64Image !== null) {
      this.user.photo = this.base64Image;
    } else {
      delete this.user.photo;
    }
    
      this.userService.updateUser(this.userId, this.user).subscribe({
        next: (response) => {
          Swal.fire({
            icon: "success",
            title: "Succès",
            text: "Modification Reussie!",
            showConfirmButton: false,
            timer: 1500
          });
          this.retourVersListe(response.user.role); 
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: err.error.message,
          });
          console.error(err);
        }
      })
    
  }
  
  // Méthode pour revenir à la page des employés
  retourVersListe(role: String): void {
    if(role == 'employe') {
      this.router.navigate(['learners', this.name]);
    } else if(role == 'etudiant') {
      this.router.navigate(['listeaprenant', this.name]);
    } else {
      this.router.navigate(['liste']);
    }
  }
  

}
