import { Injectable } from '@angular/core';
import { UiService } from './ui.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {

  constructor(private uiService: UiService) { }

  handleError(error: any): void {
    if (error.status === 401) {
      this.uiService.showSnackbar('Login failed. Please check your credentials.');
    } else if (error.status === 400) {
      this.uiService.showSnackbar('Registration failed. Please try again.');
    } else {
      this.uiService.showSnackbar('An unexpected error occurred. Please try again later.');
    }
  }
}
