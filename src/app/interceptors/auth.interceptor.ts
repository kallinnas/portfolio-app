import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { EMPTY, from, Observable } from 'rxjs';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';


// export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//   const authService: AuthService = inject(AuthService);
//   const accessToken = authService.getAccessToken();

//   if (!accessToken) {
//     return next(req);
//   }

//   const clonedReq = attachTokenToRequest(req, accessToken);

//   return next(clonedReq).pipe( // proceed request with attached AccessToken
//     catchError((error: HttpErrorResponse) => {

//       if (error.status === 401) { // set during login proccess in cookie - refreshToken brings valid AccessToken if last expaired
//         return authService.refreshAccessToken().pipe(

//           switchMap((newToken) => {
//             if (newToken.accessToken) { // update request with new accessToken
//               const retryReq = attachTokenToRequest(req, newToken.accessToken.result);
//               return next(retryReq);
//             }

//             return EMPTY;
//           }),

//           catchError((err) => {
//             authService.logout();
//             return EMPTY;
//           }));
//       }

//       return EMPTY;
//     }));
// };

// function attachTokenToRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
//   return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
// }

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService: AuthService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  if (!accessToken) {
    return next(req);  // If no access token, continue request
  }

  const clonedReq = attachTokenToRequest(req, accessToken);

  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {  // Handle 401 errors
        return from(authService.refreshAccessToken()).pipe(

          switchMap(() => {
            const newAccessToken = authService.getAccessToken();
            const retryReq = attachTokenToRequest(req, newAccessToken!);
            return next(retryReq);  // Retry request with new token
          }));
      }

      authService.logout();
      return EMPTY;  // Fail silently for other errors
    }));
};

function attachTokenToRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}