import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LearnersComponent } from './components/learners/learners.component'; // Gestion des employés
import { InscriptionComponent } from './components/inscription/inscription.component'; // Assurez-vous du chemin correct
import { ModificationComponent } from './components/modification/modification.component';
import { ApprenantComponent } from './components/apprenant/apprenant.component';
import { ListeaprenantComponent } from './components/listeaprenant/listeaprenant.component';
import { DepartementComponent } from './components/departement/departement.component';
import { AjoutdepartementComponent } from './components/ajoutdepartement/ajoutdepartement.component';
import { AttendanceListComponent } from './components/attendance-list/attendance-list.component';
import { GestionCartesComponent } from './components/gestion-cartes/gestion-cartes.component';
import { AssignerCarteComponent } from './components/assigner-carte/assigner-carte.component';
export const appRoutes: Routes = [  // Exportez correctement appRoutes
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },  // Redirection par défaut
  { path: 'dashboard', component: DashboardComponent },      // Route pour le dashboard
  { path: 'learners', component: LearnersComponent },        // Gestion des employés
  { path: 'inscription', component: InscriptionComponent },  // Route pour l'inscription
  { path: 'modification/:id', component: ModificationComponent }, // Route pour la modification
  { path: 'apprenant', component: ApprenantComponent }, // Route pour la modification
  { path: 'listeaprenant', component: ListeaprenantComponent }, // Route pour la modification
  { path: 'departement', component: DepartementComponent }, // Route pour la modification
  { path: 'ajoutdepartement', component: AjoutdepartementComponent }, // Route pour la modification
  { path: 'attendance-list', component: AttendanceListComponent }, // Route pour la modification
  { path: 'gestion-cartes', component: GestionCartesComponent }, // Route pour la modification
  { path: 'assigner-carte', component: AssignerCarteComponent }, // Route pour la modification

];
