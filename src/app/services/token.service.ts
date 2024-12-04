import { catchError, map, Observable, of } from 'rxjs';
import { Injectable, signal } from '@angular/core';

import { environment } from '../../environments/environment';
import { TokenStatus } from '../model/token-status.model';
import { NavigationService } from './navigation.service';
import { UiService } from './ui.service';


@Injectable({ providedIn: 'root' })
export class TokenService {

  private baseUrl: string = `${environment.apiUrl}/Token`;

  private accessToken: string | null = null;
  getAccessToken(): string | null { return this.accessToken; }
  isAccessTokenExists(): boolean { return this.accessToken != null; }
  setAccessToken(token: any = null): void { this.accessToken = token; this.authorizeUser(); }
  removeAccessToken(): void { this.accessToken = null; this.isAuthenticated.set(false); this.navigationService.router.navigate(['auth']); }
  isAuthorized(): boolean { return !!this.getUserRole() && this.isAccessTokenExists() && this.isAuthenticated() }

  isAuthenticated = signal<boolean>(false);

  constructor(
    private uiService: UiService,
    private navigationService: NavigationService,
  ) { }

  validateToken(): Observable<boolean> {
    return this.navigationService.http.get<{ status: TokenStatus }>(
      `${this.baseUrl}/validateToken`, { withCredentials: true }).pipe(
        map((response) => {
          switch (response.status) {
            case TokenStatus.Valid:
              return true;

            case TokenStatus.NotFound:
              this.uiService.showSnackbar('Sign in or Login to start a new session.');
              this.removeAccessToken();
              return false;

            case TokenStatus.Invalid:
              this.uiService.showSnackbar('Session has been expired. Relogin please.');
              this.removeAccessToken();
              return false;

            default:
              console.warn("Unexpected status:", response.status);
              return false;
          }
        }),

        catchError((error) => {
          this.removeAccessToken();
          console.error('Error during token validation:', error);
          this.uiService.showSnackbar("Failed to refresh session.");
          return of(false);
        }));
  }

  authorizeUser(): void {
    this.isAuthenticated.set(true);
    this.getUserRole() === '1' ? this.navigationService.router.navigate(['home']) : this.navigationService.router.navigate(['cv']);
  }

  getUserRole(): string | null {
    if (!this.accessToken) return null;
    const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
    return payload['role'];
  }
}
