import { Routes } from '@angular/router';
import { authGuard } from './authenticate/authenticate.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', 
    loadComponent: () => import('./authenticate/authenticate/authenticate.component').then(m => m.AuthenticateComponent) 
  },
  { path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  }
];
