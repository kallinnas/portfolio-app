import { Injectable } from '@angular/core';

import { RefreshTokenState } from '../../model/refresh-token-state.model';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from './access-token.service';
import { NavigationService } from '../navigation.service';
import { UiService } from '../ui.service';

@Injectable({ providedIn: 'root' })
export class RefreshTokenService {

  private baseUrl: string = `${environment.apiUrl}/RefreshToken`;

  constructor(
    private uiService: UiService,
    private navigationService: NavigationService,
    private accessTokenService: AccessTokenService,
  ) { }

  validateRefreshToken(): void {
    this.navigationService.http.get<any>(`${this.baseUrl}/validateRefreshToken`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          switch (response.status) {
            case RefreshTokenState.Valid:
              this.accessTokenService.updateAccessToken();
              break;
            case RefreshTokenState.NotFound:
            case RefreshTokenState.Invalid:
              this.uiService.showSnackbar(response.message);
              // this.accessTokenService.isAuthenticated.set(false);
              // this.uiService.showSnackbar('Sign in or Login to start a new session.');
              break;
            default:
              console.log("Unexpected response:", response);
          }
        },

        error: (err) => { console.error('Refresh token check failed:', err); }
      });
  }

}
