import { Injectable, signal } from '@angular/core';

import { environment } from '../../environments/environment';
import { NavigationService } from './navigation.service';
import { UserRegistrDto } from '../model/user.model';
import { TokenService } from './token.service';
import { UiService } from './ui.service';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl: string = `${environment.apiUrl}/Auth`;

  isRegisterMode = signal<boolean>(false);

  constructor(
    private navigationService: NavigationService,
    private accessTokenService: TokenService,
    private uiService: UiService,
  ) { }

  login(email: string, password: string): void {
    this.navigationService.http.post<any>(`${this.baseUrl}/login`, { email, password }, { withCredentials: true })
      .subscribe({
        next: () => {
          this.navigationService.router.navigate(['home']);
          this.uiService.showSnackbar('Loged in successfully.');
        },
        error: err => { console.error('Login failed', err); }
      });
  }

  register(user: UserRegistrDto): void {
    this.navigationService.http.post<any>(`${this.baseUrl}/register`, user, { withCredentials: true })
      .subscribe({
        next: () => {
          this.navigationService.router.navigate(['home']);
          this.uiService.showSnackbar('Registration completed successfully.');
        },
        error: err => { console.error('Registration failed', err); }
      });
  }

  logout(): void {
    this.navigationService.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.accessTokenService.removeAccessToken();
        this.uiService.showSnackbar('Logout successfully.');
      },
      error: err => { console.error('Logout failed', err); },
    });
  }

  // getUserId(): string | null {
  //   const token = this.getToken();
  //   if (!token) return null;

  //   const payload = JSON.parse(atob(token.split('.')[1]));
  //   return payload['nameid']; // 'nameid' corresponds to ClaimTypes.NameIdentifier
  // }

}
