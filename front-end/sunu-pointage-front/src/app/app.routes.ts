import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard-vigile.component';

export const routes: Routes = [

    { path: '', redirectTo: '/dashboard-vigile', pathMatch: 'full' },
    { path: 'dashboard-vigile', component: DashboardComponent }
];
