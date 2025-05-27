// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'validate-idea',
    loadComponent: () => import('./pages/validate-idea/validate-idea.component').then(m => m.ValidateIdeaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-ideas',
    loadComponent: () => import('./pages/my-ideas/my-ideas.component').then(m => m.MyIdeasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'idea/:id',
    loadComponent: () => import('./pages/idea-details/idea-details.component').then(m => m.IdeaDetailsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-callback',
    loadComponent: () => import('./pages/payment-callback/payment-callback.component').then(m => m.PaymentCallbackComponent),
    canActivate: [AuthGuard]
  }
];
