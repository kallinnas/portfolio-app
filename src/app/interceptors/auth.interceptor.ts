import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';


export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService: AuthService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  if (!accessToken) {
    return next(req);
  }

  const clonedReq = attachTokenToRequest(req, accessToken);

  return next(clonedReq).pipe( // proceed request with attached AccessToken
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) { // set during login proccess in cookie - refreshToken brings valid AccessToken if last expaired
        return authService.updateAccessToken().pipe(

          switchMap((newToken) => {
            if (newToken.accessToken) { // update request with new accessToken
              const retryReq = attachTokenToRequest(req, authService.getAccessToken()!);
              return next(retryReq);
            }

            return EMPTY;
          }),

          catchError((err) => {
            authService.logout(true);
            return EMPTY;
          }));
      }

      return EMPTY;
    }));
};

function attachTokenToRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}
