import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userRole = this.authService.getUserRole();
    const allowedRoles = route.data['role'];

    if (allowedRoles && allowedRoles.includes(userRole)) {
      return true;
    }

    // Redirection si l'utilisateur n'a pas accès
    this.router.navigate(['/connection']);
    return false;
  }
}
