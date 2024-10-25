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

  private accessToken: string | null = null;
  getAccessToken(): string | null { return this.accessToken; }
  removeAccessToken(): void { this.accessToken = null; }

  constructor(
    public router: Router,
    private http: HttpClient,
  ) {
    this.checkAuthentication();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }, { withCredentials: true });
  }

  register(user: UserRegistrDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  refreshAccessToken(): Observable<any> {
    return this.http.post(`${this.baseUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.accessToken = response.accessToken.result;
      }));
  }

  logout(): void {
    this.http.post(`${this.baseUrl}/logout`, {}).subscribe(() => {
      this.removeAccessToken();
      this.isAuthenticated.set(false);
      this.router.navigate(['auth']);
    });
  }

  private validateToken(token: string): Observable<any> {
    return this.http.post<boolean>(`${this.baseUrl}/validateToken`, { token });
  }

  checkAuthentication(): void {
    if (this.accessToken) {
      this.validateToken(this.accessToken).subscribe(isValid => {
        if (isValid) {
          this.isAuthenticated.set(true);
          this.authorizeUser();
        }

        else {
          this.isAuthenticated.set(false);
          this.removeAccessToken();
        }
      });
    }

    else { this.isAuthenticated.set(false); }
  }

  authorizeUser(token: any = null) {
    this.accessToken = token;
    this.isAuthenticated.set(true);

    const userRole = this.getUserRole();

    if (userRole) {
      if (userRole === '1') {
        this.router.navigate(['home']);
      }

      else {
        this.router.navigate(['home']);
      }
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
