import { Observable } from 'rxjs';
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

  constructor(
    public router: Router,
    private http: HttpClient,
  ) { 
    this.checkAuthentication();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  register(user: UserRegistrDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  logout(): void {
    this.http.post(`${this.baseUrl}/logout`, {}).subscribe(() => {
      this.isAuthenticated.set(false);
      this.router.navigate(['auth']);
    });
  }

  private validateToken(token: string): Observable<any> {
    return this.http.post<boolean>(`${this.baseUrl}/validateToken`, { token });
  }

  checkAuthentication(): void {
    const token = this.getToken();

    if (token) {
      this.validateToken(token).subscribe(isValid => {
        if (isValid) {
          this.isAuthenticated.set(true);
          this.authorizeUser();
        }

        else { localStorage.removeItem('token'); }
      });
    }

    else { this.isAuthenticated.set(false); }
  }

  authorizeUser(token: any = null) {
    this.isAuthenticated.set(true);

    if (token) {
      localStorage.setItem('token', token);
    }

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

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    } else return null;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['role'];
  }

  // getUserId(): string | null {
  //   const token = this.getToken();
  //   if (!token) return null;

  //   const payload = JSON.parse(atob(token.split('.')[1]));
  //   return payload['nameid']; // 'nameid' corresponds to ClaimTypes.NameIdentifier
  // }

}
