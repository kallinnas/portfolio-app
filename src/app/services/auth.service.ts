import { Injectable, signal } from '@angular/core';

import { UserRegistrDto } from '../model/user.model';
import { NavigationService } from './navigation.service';
import { AccessTokenService } from './token/access-token.service';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl: string = `${environment.apiUrl}/Auth`;

  isRegisterMode = signal<boolean>(false);

  constructor(
    private navigationService: NavigationService,
    private accessTokenService: AccessTokenService,
  ) { }

  login(email: string, password: string): void {
    this.navigationService.http.post<any>(`${this.baseUrl}/login`, { email, password }, { withCredentials: true })
      .subscribe({
        next: response => { this.accessTokenService.setAccessToken(response.accessToken); },
        error: err => { console.error('Login failed', err); }
      });
  }

  register(user: UserRegistrDto): void {
    this.navigationService.http.post<any>(`${this.baseUrl}/register`, user, { withCredentials: true })
      .subscribe({
        next: response => { this.accessTokenService.setAccessToken(response.accessToken); },
        error: err => { console.error('Registration failed', err); }
      });
  }

  logout(afterRefreshToken: boolean = false): void {
    this.accessTokenService.removeAccessToken();
    this.navigationService.http.post(`${this.baseUrl}/logout`, {}).subscribe(() => {
      this.navigationService.router.navigate(['auth']);
      // this.afterRefreshToken = afterRefreshToken;
    });
  }

  // getUserId(): string | null {
  //   const token = this.getToken();
  //   if (!token) return null;

  //   const payload = JSON.parse(atob(token.split('.')[1]));
  //   return payload['nameid']; // 'nameid' corresponds to ClaimTypes.NameIdentifier
  // }

}
