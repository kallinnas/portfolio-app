import { Observable, tap } from 'rxjs';
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { UserRegistrDto } from '../model/user.model';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl: string = `${environment.apiUrl}/Auth`;
  isAuthenticated = signal<boolean>(false);
  isRegisterMode = signal<boolean>(false);
  afterRefreshToken: boolean = false;

  private accessToken: string | null = null;
  getAccessToken(): string | null { return this.accessToken; }
  removeAccessToken(): void { this.accessToken = null; }

  constructor(
    public router: Router,
    private http: HttpClient,
  ) {
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    this.accessToken ? this.validateAccessToken() : this.isAuthenticated.set(false);
  }

  validateAccessToken(): Observable<any> {
    return this.http.post<boolean>(`${this.baseUrl}/validateToken`, { token: this.accessToken }).pipe(
      tap(isValid => {
        isValid ? this.authorizeUser() : this.refreshAccessToken();
      }));
  }

  refreshAccessToken(): Observable<any> {
    this.removeAccessToken();

    return this.http.post(`${this.baseUrl}/refreshToken`, {}, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.accessToken = response.accessToken.result;
      }));
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }, { withCredentials: true });
  }

  register(user: UserRegistrDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user, { withCredentials: true });
  }

  logout(afterRefreshToken: boolean = false): void {
    this.removeAccessToken();
    this.http.post(`${this.baseUrl}/logout`, {}).subscribe(() => {
      this.isAuthenticated.set(false);
      this.router.navigate(['auth']);
      this.afterRefreshToken = afterRefreshToken;
    });
  }

  authorizeUser(token: any = null) {
    this.afterRefreshToken = false;
    this.accessToken = token;
    this.isAuthenticated.set(true);

    const userRole = this.getUserRole();

    if (userRole) {
      if (userRole === '1') { this.router.navigate(['home']); }
      else { this.router.navigate(['home']); }
    }
  }

  getUserRole(): string | null {
    if (!this.accessToken) return null;
    const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
    return payload['role'];
  }

  // getUserId(): string | null {
  //   const token = this.getToken();
  //   if (!token) return null;

  //   const payload = JSON.parse(atob(token.split('.')[1]));
  //   return payload['nameid']; // 'nameid' corresponds to ClaimTypes.NameIdentifier
  // }

}
