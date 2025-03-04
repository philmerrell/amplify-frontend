import { Injectable, inject, signal } from '@angular/core';
import { AuthTokenService } from '../auth/auth-token.service';

export interface User {
  email_verified: boolean;
  username: string;
  id: string;
  email: string;
}

export interface DecodedToken {
  at_hash: string;
  sub: string;
  email_verified: boolean;
  iss: string;
  'cognito:username': string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private authTokenService = inject(AuthTokenService);
  
  // Use signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);
  
  // Expose read-only signals
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  
  constructor() {
    this.checkAuthStatus();
  }
  
  /**
   * Check if the user is authenticated and update the state
   */
  async checkAuthStatus(): Promise<boolean> {
    const accessToken = this.authTokenService.getAccessToken();
    
    if (!accessToken) {
      this.clearUserState();
      return false;
    }
    
    const isExpired = await this.authTokenService.isAccessTokenExpired(accessToken);
    
    if (isExpired) {
      this.clearUserState();
      return false;
    }
    // Token is valid, extract user info
    const idToken = this.authTokenService.getIdToken();
    if (!idToken) {
      this.clearUserState();
      return false;
    }
    const decodedToken = this.authTokenService.decodeIdToken(idToken);
    this.setUserFromToken(decodedToken);
    this.isAuthenticatedSignal.set(true);
    return true;
  }
  
  /**
   * Set user information from the decoded token
   */
  private setUserFromToken(decodedToken: DecodedToken): void {
    if (!decodedToken) {
      this.clearUserState();
      return;
    }
    
    const user: User = {
      email_verified: decodedToken.email_verified,
      username: decodedToken['cognito:username'],
      id: decodedToken.sub,
      email: decodedToken.email
    };

    this.currentUserSignal.set(user);
    this.isAuthenticatedSignal.set(true);
  }
  
  /**
   * Clear user state on logout or token expiration
   */
  clearUserState(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }
} 