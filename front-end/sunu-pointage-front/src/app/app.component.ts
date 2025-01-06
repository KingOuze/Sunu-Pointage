import { Component } from '@angular/core';
<<<<<<< HEAD
import { RouterOutlet } from '@angular/router';  // Importer RouterOutlet
import { FormsModule } from '@angular/forms'; // Importer FormsModule
=======
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard-vigile/dashboard-vigile.component';


>>>>>>> fdcb699f818d01d9d249250c03d2053d1373342e

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [ RouterOutlet,FormsModule],  // Ajoutez RouterOutlet ici
  template: `
    <router-outlet></router-outlet>  <!-- Ceci est où les composants basés sur les routes s'affichent -->
  `
=======
  imports: [DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
>>>>>>> fdcb699f818d01d9d249250c03d2053d1373342e
})
export class AppComponent {}
