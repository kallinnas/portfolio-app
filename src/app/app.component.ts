import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { RefreshTokenService } from './services/token/refresh-token.service';
import { AccessTokenService } from './services/token/access-token.service';
import { GeneralModule } from './modules/general.model';
import { AuthService } from './services/auth.service';
import { ValidationTokenService } from './services/token/validation-token.service';


@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterOutlet, GeneralModule, SidenavComponent, HeaderComponent],
  templateUrl: './app.component.html', styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public accessTokenService: AccessTokenService,
    public refreshTokenService: RefreshTokenService,
    public validationTokenService: ValidationTokenService,
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.validationTokenService.validateTokenProccess();
    }
  }

}
