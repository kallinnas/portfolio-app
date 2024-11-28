import { catchError, Observable, tap, throwError } from 'rxjs';
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
        isValid ? this.authorizeUser() : this.updateAccessToken();
      }));
  }

  updateAccessToken(): Observable<any> {
    this.removeAccessToken();

    return this.http.post(`${this.baseUrl}/updateAccessToken`, {}, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.accessToken = response.accessToken.result;
      }));
  }

  login(email: string, password: string): void {
    this.http.post<any>(`${this.baseUrl}/login`, { email, password }, { withCredentials: true })
      .subscribe({
        next: response => { this.authorizeUser(response.accessToken); },
        error: err => { console.error('Login failed', err); }
      });
  }

  register(user: UserRegistrDto): void {
    this.http.post<any>(`${this.baseUrl}/register`, user, { withCredentials: true })
      .subscribe({
        next: response => { this.authorizeUser(response.accessToken); },
        error: err => { console.error('Registration failed', err); }
      });
  }

  logout(afterRefreshToken: boolean = false): void {
    this.removeAccessToken();
    this.http.post(`${this.baseUrl}/logout`, {}).subscribe(() => {
      this.isAuthenticated.set(false);
      this.router.navigate(['auth']);
      this.afterRefreshToken = afterRefreshToken;
    });
  }
  
  private authorizeUser(token: any = null): void {
    this.afterRefreshToken = false;
    this.accessToken = token;
    this.isAuthenticated.set(true);

    this.getUserRole() === '1' ? this.router.navigate(['home']) : this.router.navigate(['home']);
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
