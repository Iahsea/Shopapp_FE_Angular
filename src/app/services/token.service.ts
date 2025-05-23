import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly TOKEN_KEY = 'access_token';
  private jwtHelper = new JwtHelperService();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  setToken(token: string): void {
    return localStorage.setItem(this.TOKEN_KEY, token);
  }

  getUserId(): number {
    let userObject = this.jwtHelper.decodeToken(this.getToken() ?? '');
    if (userObject && 'userId' in userObject) {
      return parseInt(userObject['userId']);
    }
    return 0;
  }

  removeToken(): void {
    return localStorage.removeItem(this.TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    if (this.getToken() == null) {
      return false;
    }
    return this.jwtHelper.isTokenExpired(this.getToken()!);
  }
}
