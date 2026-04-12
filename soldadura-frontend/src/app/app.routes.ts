import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard/user',
    canActivate: [authGuard, roleGuard(['user', 'admin'])],
    loadComponent: () =>
      import('./features/dashboard/user/user-dashboard.component').then(
        (m) => m.UserDashboardComponent,
      ),
  },
  {
    path: 'dashboard/owner',
    canActivate: [authGuard, roleGuard(['owner', 'admin'])],
    loadComponent: () =>
      import('./features/dashboard/owner/owner-dashboard.component').then(
        (m) => m.OwnerDashboardComponent,
      ),
  },
  {
    path: 'dashboard/admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () =>
      import('./features/dashboard/admin/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
