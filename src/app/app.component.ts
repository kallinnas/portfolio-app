import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';

import { filter, Subscription } from 'rxjs';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GeneralModule } from './modules/general.model';
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
  // isAuthorized: boolean = false;
  isAuthPage: boolean = false;

  constructor(
    public authService: AuthService,
  ) {

    // effect(() => {// Use ng's `effect` to react to signal changes
    //   const token = localStorage.getItem('token');

    //   if (this.authService.isAuthenticated() && token == undefined) {
    //   } 

    //   else {
    //     localStorage.removeItem('token');
    //   }
    // });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.authService.checkAuthentication();

      this.authService.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          const authRoutes = ['/auth'];
          this.isAuthPage = authRoutes.includes(event.urlAfterRedirects);
        });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
