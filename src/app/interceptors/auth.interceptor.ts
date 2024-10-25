import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService: AuthService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  if (accessToken) {
    const clonedReq = req.clone({
      withCredentials: true,
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Call refresh token and retry the request
          return authService.refreshAccessToken().pipe(
            switchMap((newToken) => {
              // Ensure the new token is properly retrieved
              if (newToken.accessToken) {
                const retryReq = req.clone({
                  withCredentials: true,
                  setHeaders: {
                    Authorization: `Bearer ${newToken.accessToken.result}`,
                  },
                });
                return next(retryReq);
              }
              // Logout if refresh token fails
              authService.logout();
              return throwError(() => error);
            }),
            catchError((err) => {
              authService.logout();
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
