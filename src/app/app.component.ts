import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';

import { filter, Subscription } from 'rxjs';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GeneralModule } from './modules/general.model';
import { ApiAuthService } from './service/api-auth.service';
import { AuthService } from './service/auth.service';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GeneralModule, RouterLink, MatProgressSpinnerModule, SidenavComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  isAuthorized: boolean = false;
  isAuthPage: boolean = false;

  constructor(
    public authService: AuthService,
    public apiAuthService: ApiAuthService,
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.apiAuthService.checkAuthentication();

      this.subscriptions.push(
        this.apiAuthService.isAuthenticatedSubject$.subscribe(valid => {
          this.isAuthorized = valid;
          if (valid) {
            const token = localStorage.getItem('token');
            // && this.signalrService.hubConnection.state === signalR.HubConnectionState.Connected
            // if (!this.signalrService.hubConnection) {
            //   this.authService.launchHub(token!);
            // }
          }
        }));
    }

    this.authService.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const authRoutes = ['/auth'];
        this.isAuthPage = authRoutes.includes(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
