import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./conversation/conversation.page').then( m => m.ConversationPage)
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
