import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { Injectable } from "@angular/core";

import { TokenService } from "../services/token.service";
import { NavigationService } from "../services/navigation.service";


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private navigationService: NavigationService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.tokenService.isAuthorized()) {
      return true;
    }

    else {
      if (typeof window !== 'undefined') {
        this.tokenService.validateToken().subscribe({
          next: () => {
            if (this.tokenService.isAuthorized()) {
              return true;
            }

            return false;
          },

          error: (err: boolean) => {
            console.error('Token validation failed:', err);
            this.navigationService.router.navigate(['auth']);
            return false;
          }
        });
      }
    }

    return false;
  }
}

// if (route.routeConfig?.path === 'home' || route.routeConfig?.path === 'cv') {
//   if (userRole === '1') {           return true;        }
//   else {          return false;        }      }