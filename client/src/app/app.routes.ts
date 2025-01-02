import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'settings/import-conversations',
    loadComponent: () => import('./settings/import-conversations/import-conversations.page').then( m => m.ImportConversationsPage)
  },
  {
    path: 'settings/developer',
    loadComponent: () => import('./settings/developer/developer.page').then( m => m.DeveloperPage)
  },
];
