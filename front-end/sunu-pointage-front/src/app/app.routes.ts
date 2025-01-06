import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard-vigile/dashboard-vigile.component';

export const routes: Routes = [

    { path: '', redirectTo: '/dashboard-vigile', pathMatch: 'full' },
    { path: 'dashboard-vigile', component: DashboardComponent },
    { path: 'dashboard-pointage', component: DashboardComponent },
];