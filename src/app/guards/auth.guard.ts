import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const AuthGuardFn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const isTokenExpired = tokenService.isTokenExpired();
  const isUserIdValid = tokenService.getUserId() > 0;

  debugger;

  if (!isTokenExpired && isUserIdValid) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
