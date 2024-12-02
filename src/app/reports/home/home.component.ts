import { Component } from '@angular/core';
import { TestService } from '../../services/test.service';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home', standalone: true,
  imports: [],
  templateUrl: './home.component.html', styleUrl: './home.component.scss'
})
export class HomeComponent {

  message: string = '';
  constructor(
    private uiService: UiService,
    private testService: TestService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.testService.getTestMessage().subscribe({
        next: data => {
          this.message = data.message;
        },
        error: err => {
          this.uiService.showSnackbar('Please try to relogin.');
          this.authService.logout();
        }
      });
    }
  }
}
