import { Routes } from '@angular/router';
import { authGuard } from './authenticate/authenticate.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', 
    loadComponent: () => import('./authenticate/authenticate/authenticate.component').then(m => m.AuthenticateComponent) 
  },
  { path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    // canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'inventory', pathMatch: 'full' },
      { path: 'inventory',
        loadComponent: () => import('./dashboard/inventory/inventory.component').then(m => m.InventoryComponent),
      },
      { path: 'store',
        loadComponent: () => import('./dashboard/store/store.component').then(m => m.StoreComponent),
      },
      { path: 'history',
        loadComponent: () => import('./dashboard/history/history.component').then(m => m.HistoryComponent),
      }
    ]
  }
];
