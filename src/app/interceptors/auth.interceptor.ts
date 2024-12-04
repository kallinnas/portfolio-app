import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { TokenService } from '../services/token.service';


export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const accessTokenService: TokenService = inject(TokenService);
  const accessToken = accessTokenService.getAccessToken();

  if (accessToken) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const newAccessToken = event.headers.get('access-token');
        
        if (newAccessToken) {
          accessTokenService.setAccessToken(newAccessToken);
        }
      }
    }));
}
