import { Component, computed, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AccessTokenService } from '../../services/token/access-token.service';
import { GeneralModule } from '../../modules/general.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [GeneralModule, RouterLink],
  templateUrl: './header.component.html', styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Output() sidenavToggle = new EventEmitter<void>();

  isRegisterMode = computed(() => this.authService.isRegisterMode());
  isAuthenticated = computed(() => this.accessTokenService.isAuthenticated());

  logoutBtn: string = 'Logout'

  constructor(
    public authService: AuthService,
    private accessTokenService: AccessTokenService,

  ) { }

  onAccessMode() { this.authService.isRegisterMode.set(!this.isRegisterMode()); }

  onToggleSidenav() { this.sidenavToggle.emit(); }

  onLogout() { this.authService.logout(); }
}
