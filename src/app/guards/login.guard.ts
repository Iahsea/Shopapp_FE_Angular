import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

export const LoginGuardFn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const isTokenExpired = tokenService.isTokenExpired();
  const isUserIdValid = tokenService.getUserId() > 0;

  debugger;

  if (!isTokenExpired && isUserIdValid) {
    router.navigate(['/']);
    return false;
  } else {
    return true;
  }
};
