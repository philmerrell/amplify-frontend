import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  private readonly jwt = new JwtHelperService();
  constructor() { }

  public async isAccessTokenExpired(jwt: string): Promise<boolean> {
    try {
      const isExpired = this.jwt.isTokenExpired(jwt);
      return isExpired;
    } catch (error) {
      return false 
    }
  }

  public decodeAccessToken(jwt: string) {
    try {
      const decoded = this.jwt.decodeToken(jwt);
      return decoded;
    } catch (error) {
      return {
        message: "The inspected token doesn't appear to be a JWT."
      }
    }
  }

  getAuthTokenFromLocalStorage() {
    return localStorage.getItem('developerToken');
  }
}
