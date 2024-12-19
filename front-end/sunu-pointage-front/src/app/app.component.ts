import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  // Importer RouterOutlet
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LearnersComponent } from './components/learners/learners.component';
import { ModificationComponent } from './components/modification/modification.component';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet,FormsModule],  // Ajoutez RouterOutlet ici
  template: `
    <router-outlet></router-outlet>  <!-- Ceci est où les composants basés sur les routes s'affichent -->
  `
})
export class AppComponent {}
