import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../services/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toaster: ToasterService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole = route.data['role'];
    const userRole = this.authService.getUserRole();

    if (userRole === requiredRole) {
      return true;
    }

    this.toaster.error('You do not have permission to access this area');
    this.router.navigate(['/']);
    return false;
  }
} 
// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { ToasterService } from '../services/toaster.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class RoleGuard implements CanActivate {
//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private toaster: ToasterService
//   ) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     const requiredRole = route.data['role'];
//         const userRole = this.authService.getUserRole();
    
//         if (userRole === requiredRole) {
//           return true;
//         }

//     this.toaster.error('You do not have permission to access this area');
//     this.router.navigate(['/']);
//     return false;
//   }
// }