import { Injectable } from '@angular/core';
import { CanActivateChild, Router, UrlTree } from '@angular/router';
import { IpAuthService } from '../invopay/services/ip-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardProtectedRoutes implements CanActivateChild {
  constructor(private authService: IpAuthService, private router: Router) {}

  canActivateChild(): boolean | UrlTree {
    const token = this.authService.getToken();
    if (!token) {
      //redirige al login-broker si no hay token
      return this.router.createUrlTree(['/invopay/login-broker']);
    }
    return true;
  }
}