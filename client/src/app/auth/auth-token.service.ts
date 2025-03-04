import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DecodedToken, UserService } from '../services/user.service';
@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  
  private readonly jwt = new JwtHelperService();

  public async isAccessTokenExpired(jwt: string): Promise<boolean> {
    try {
      const isExpired = this.jwt.isTokenExpired(jwt);
      return isExpired;
    } catch (error) {
      return false 
    }
  }

  public decodeIdToken(jwt: string): DecodedToken {
    try {
      const decoded = this.jwt.decodeToken(jwt);
      return decoded;
    } catch (error) {
      console.error('Error decoding ID token:', error);
      throw error;
    }
  }

  public canRefreshToken(): boolean {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }
    const isExpired = this.jwt.isTokenExpired(refreshToken);
    return !isExpired;
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  } 

  getIdToken() {
    return localStorage.getItem('idToken');
  }
  

  setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  setRefreshToken(refresh_token: string) {
    localStorage.setItem('refreshToken', refresh_token);
  }

  setIdToken(id_token: string) {
    localStorage.setItem('idToken', id_token);
  }

  removeAccessToken(): void {
    localStorage.removeItem('accessToken');
  } 

  removeRefreshToken(): void {
    localStorage.removeItem('refreshToken');
  }

  removeIdToken(): void {
    localStorage.removeItem('idToken'); 
  }
}
