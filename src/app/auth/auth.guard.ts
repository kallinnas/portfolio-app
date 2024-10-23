import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (!token) {
        this.router.navigate(['auth']);
        return false;
      }

      const userRole = this.authService.getUserRole();

      if (!userRole) {
        this.router.navigate(['auth']);
        return false;
      }

      if (route.routeConfig?.path === 'home' || route.routeConfig?.path === 'cv') {
        if (userRole === '1') { // admin
          return true;
        } 
        
        else {
          this.router.navigate(['home']);
          return false;
        }
      }
    } 
    
    else {
      this.router.navigate(['auth']);
      return false;
    }

    return true;
  }
}
