import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then(m => m.Home), pathMatch: 'full' },
  { path: 'categories', loadComponent: () => import('./categories/categories').then(m => m.Categories) },
  { path: '**', redirectTo: '' }
];
