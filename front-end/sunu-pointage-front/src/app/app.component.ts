import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  // Importer RouterOutlet
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
