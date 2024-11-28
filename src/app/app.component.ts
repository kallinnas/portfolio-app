import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';

import { filter, Subscription } from 'rxjs';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GeneralModule } from './modules/general.model';
import { AuthService } from './services/auth.service';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GeneralModule, MatProgressSpinnerModule, SidenavComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  isAuthPage: boolean = false;

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {

      this.authService.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          const authRoutes = ['/auth'];
          this.isAuthPage = authRoutes.includes(event.urlAfterRedirects);
        });
    }
  }

}
