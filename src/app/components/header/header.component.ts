import { Component, computed, EventEmitter, Output } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { RouterLink } from '@angular/router';
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
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  logoutBtn: string = 'Logout'

  constructor(
    public authService: AuthService,
  ) { }

  onAccessMode() { this.authService.isRegisterMode.set(!this.isRegisterMode()); }

  onToggleSidenav() { this.sidenavToggle.emit(); }

  onLogout() { this.authService.logout(); }
}
