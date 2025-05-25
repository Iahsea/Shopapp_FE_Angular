import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserResponse } from '../responses/user/user.response';

export const AdminGuardFn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {

  let userResponse: UserResponse | null = null;

  const tokenService = inject(TokenService);
  const router = inject(Router);
  const userService = inject(UserService);

  const isTokenExpired = tokenService.isTokenExpired();
  const isUserIdValid = tokenService.getUserId() > 0;
  userResponse = userService.getUserResponseFromLocalStorage();
  const isAdmin = userResponse?.role.name == 'admin';
  debugger;
  if (!isTokenExpired && isUserIdValid && isAdmin) {
    return true;
  } else {
    // Nếu không authenticated, bạn có thể redirect hoặc trả về một UrlTree khác.
    // Ví dụ trả về trang login:
    router.navigate(['/login']);
    return false;
  }
};