import { inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthTokenService } from './auth-token.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  private httpBackend = inject(HttpBackend);
  private router = inject(Router);
  private authTokenService = inject(AuthTokenService);
  private userService = inject(UserService);  

  redirectUrl: string = '';

  // Cognito configuration
  private readonly cognitoConfig = {
    clientId: environment.cognito.clientId,
    domain: environment.cognito.domain,
    redirectUri: environment.cognito.redirectUri,
    responseType: environment.cognito.responseType,
    scope: environment.cognito.scope,
    nonce: environment.cognito.nonce,
    clientSecret: environment.cognito.clientSecret
  };

  /**
   * Initiate the login process by redirecting to Cognito
   */
  login(): void {
    const authUrl = this.buildAuthUrl();
    window.location.href = authUrl;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForToken(code: string): Promise<TokenResponse> {

    const httpClient = new HttpClient(this.httpBackend);
    const tokenEndpoint = `https://${this.cognitoConfig.domain}/oauth2/token`;
    
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', this.cognitoConfig.clientId);
    params.append('redirect_uri', this.cognitoConfig.redirectUri);
    params.append('code', code);

    // need to add auth header
    const authHeader = `Basic ${btoa(`${this.cognitoConfig.clientId}:${this.cognitoConfig.clientSecret}`)}`;
    
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authHeader
    };
    try {
      const response = await firstValueFrom(
        httpClient.post<TokenResponse>(tokenEndpoint, params.toString(), { headers })
      );
      return response;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  /** Handle logout */
  logout(): void {
    this.authTokenService.removeAccessToken();
    this.authTokenService.removeRefreshToken();
    this.authTokenService.removeIdToken();
    this.userService.clearUserState();
    
    this.router.navigate(['/login']);
  }

  /**
   * Build the authorization URL for Cognito
   */
  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.cognitoConfig.clientId,
      redirect_uri: this.cognitoConfig.redirectUri,
      response_type: this.cognitoConfig.responseType,
      scope: this.cognitoConfig.scope,
      nonce: this.cognitoConfig.nonce
    });
    
    return `https://${this.cognitoConfig.domain}/login?${params.toString()}`;
  }

  /**
   * Refresh the access token
   */
  refreshToken(): Promise<TokenResponse> {
    const httpClient = new HttpClient(this.httpBackend);
    const tokenEndpoint = `https://${this.cognitoConfig.domain}/oauth2/token`;

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', this.cognitoConfig.clientId);
    params.append('refresh_token', this.authTokenService.getRefreshToken() || '');

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${this.cognitoConfig.clientId}:${this.cognitoConfig.clientSecret}`)}`
    };
    return firstValueFrom(httpClient.post<TokenResponse>(tokenEndpoint, params.toString(), { headers }));
  }

  
}

interface TokenResponse {
  id_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}