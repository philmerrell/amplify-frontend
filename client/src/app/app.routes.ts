import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-route-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./conversation/conversation.page').then( m => m.ConversationPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'auth/callback/cognito',
    loadComponent: () => import('./auth/callback/callback.page').then(m => m.CallbackPage)
  },
  {
    path: 'settings/import-conversations',
    loadComponent: () => import('./settings/import-conversations/import-conversations.page').then( m => m.ImportConversationsPage)
  },
  {
    path: 'settings/developer',
    loadComponent: () => import('./settings/developer/developer.page').then( m => m.DeveloperPage)
  },
  { path: '**', redirectTo: '' }
]
