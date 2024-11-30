import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { Injectable } from "@angular/core";

import { AccessTokenService } from "../services/token/access-token.service";
import { NavigationService } from "../services/navigation.service";
import { RefreshTokenService } from "../services/token/refresh-token.service";
import { ValidationTokenService } from "../services/token/validation-token.service";


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private validationTokenService: ValidationTokenService,
    private accessTokenService: AccessTokenService,
    private navigationService: NavigationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (typeof window !== 'undefined') {

      if (!this.accessTokenService.getAccessToken()) {
        this.validationTokenService.validateTokenProccess();        
      }

      const userRole = this.accessTokenService.getUserRole();

      if (!userRole) {
        this.navigationService.router.navigate(['auth']);
        return false;
      }

      return true;
      // if (route.routeConfig?.path === 'home' || route.routeConfig?.path === 'cv') {
      //   if (userRole === '1') { // admin
      //     return true;
      //   } 

      //   else {
      //     return false;
      //   }
      // }
    }

    return true;
  }
}
