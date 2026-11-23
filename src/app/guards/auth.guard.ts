import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();

  if (!user) {
    return router.createUrlTree(['/login']);
  }
  const allowedRoles = route.data?.['roles'] as UserRole[] | undefined;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return router.createUrlTree(['/access-denied']);
  }

  return true;
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  if (!user) {
    return true;
  }

  const target = user.role === 'ADMIN' ? '/command-center' : '/incidents';
  return router.createUrlTree([target]);
};