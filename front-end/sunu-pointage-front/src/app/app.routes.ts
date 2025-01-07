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
import { ConnexionComponent } from './connexion/connexion.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ModifierAutreComponent } from './modifier-autre/modifier-autre.component';
import { CohorteComponent } from './cohorte/cohorte.component';
import { DashboardVigileComponent } from './dashboard-vigile/dashboard-vigile.component';
//import { AuthGuard } from './auth-guard.guard';
import { ListAdminVigileComponent } from './list-admin-vigile/list-admin-vigile.component';
import { AjoutAdminComponent } from './ajout-admin/ajout-admin.component';




export const appRoutes: Routes = [  // Exportez correctement appRoutes
  { path: '', redirectTo: '/connexion', pathMatch: 'full' },  // Redirection par défaut
  { path: 'dashboard',  component: DashboardComponent },      // Route pour le dashboard
  { path: 'learners/:id', component: LearnersComponent },        // Gestion des employés
  { path: 'inscription/:id', component: InscriptionComponent },  // Route pour l'inscription
  { path: 'modification/:name/:id', component: ModificationComponent }, // Route pour la modification
  { path: 'apprenant/:id', component: ApprenantComponent }, // Route pour la modification
  { path: 'listeaprenant/:id', component: ListeaprenantComponent }, // Route pour la modification
  { path: 'departement', component: DepartementComponent }, // Route pour la modification
  { path: 'ajouter/:name', component: AjoutdepartementComponent }, // Route pour la modification
  { path: 'attendance-list', component: AttendanceListComponent }, // Route pour la modification
  { path: 'gestion-cartes', component: GestionCartesComponent }, // Route pour la modification
  { path: 'assigner-carte/:id', component: AssignerCarteComponent }, // Route pour la modification
  { path: 'connexion', component: ConnexionComponent }, // Route pour la modification
  { path: 'forgot-password', component: ForgotPasswordComponent }, //mot de pass oublié
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'modifier-autre/:name/:id', component: ModifierAutreComponent }, // Redirection vers la page de connexion si une route inexistante est utilisée
  { path: 'cohortes', component: CohorteComponent }, // Redirection to cohorte component
  { path: 'dashboard-vigile',  component: DashboardVigileComponent },
  { path: 'liste', component: ListAdminVigileComponent }, 
  { path: 'ajouter', component: AjoutAdminComponent },
  //{ path: 'dashboard-pointage', component: DashboardComponent },
];

