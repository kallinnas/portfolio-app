import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { NavigationService } from '../navigation.service';
import { UiService } from '../ui.service';


@Injectable({ providedIn: 'root' })
export class AccessTokenService {

  private baseUrl: string = `${environment.apiUrl}/AccessToken`;

  private accessToken: string | null = null;
  getAccessToken(): string | null { return this.accessToken; }
  removeAccessToken(): void { this.accessToken = null; this.isAuthenticated.set(false); }

  isAuthenticated = signal<boolean>(false);

  afterRefreshToken: boolean = false;

  constructor(
    private uiService: UiService,
    private navigationService: NavigationService,
  ) { }

  validateAccessToken(): void {
    this.navigationService.http.post<boolean>(`${this.baseUrl}/validateAccessToken`, { token: this.accessToken })
      .pipe(tap(isValid => { this.isAuthenticated.set(isValid); }));
  }

  updateAccessToken(): Observable<any> {
    this.removeAccessToken();

    return this.navigationService.http.post(`${this.baseUrl}/updateAccessToken`, {}, { withCredentials: true })
      .pipe(tap((response: any) => { this.setAccessToken(response.accessToken.result); }));
  }

  setAccessToken(token: any = null): void {
    this.accessToken = token;
    this.authorizeUser();
  }

  authorizeUser(): void {
    this.isAuthenticated.set(true);
    this.afterRefreshToken = false;

    this.getUserRole() === '1' ? this.navigationService.router.navigate(['home']) : this.navigationService.router.navigate(['cv']);
  }

  getUserRole(): string | null {
    if (!this.accessToken) return null;
    const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
    return payload['role'];
  }
}
