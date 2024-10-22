import { Component, computed, EventEmitter, Output } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [GeneralModule, RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  @Output() closeSidenav = new EventEmitter<void>();

  isRegisterMode = computed(() => this.authService.isRegisterMode());
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  logoutBtn: string = 'Logout'

  constructor(
    public authService: AuthService,
  ) { }

  onAccessMode() { this.authService.isRegisterMode.set(!this.isRegisterMode()); }

  onCloseSidenav() { this.closeSidenav.emit(); }

  onLogout() {
    this.onCloseSidenav();
    this.authService.logout();
  }
}
