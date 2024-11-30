import { Injectable } from '@angular/core';

import { RefreshTokenService } from './refresh-token.service';
import { AccessTokenService } from './access-token.service';

@Injectable({ providedIn: 'root' })
export class ValidationTokenService {

  constructor(
    private refreshTokenService: RefreshTokenService,
    private accessTokenService: AccessTokenService,
  ) { }

  validateTokenProccess(): void {
    if (!this.accessTokenService.getAccessToken()) {
      this.refreshTokenService.validateRefreshToken();
    }

    else {
      this.accessTokenService.validateAccessToken();
    }
  }
}
