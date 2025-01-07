import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],  // Ajoutez RouterOutlet ici
  templateUrl: 'app.component.html', 
})
export class AppComponent {

  role: string = '';  // Variable pour stocker le rôle de l'utilisateur

  constructor(private authService: AuthService){}

  /*ngOnInit() {
    this.role = this.authService.getUserRole(); // Récupère le rôle depuis le service
    console.log(this.role);
  }*/
}
