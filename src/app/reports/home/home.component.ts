import { Component } from '@angular/core';
import { TestService } from '../../services/test.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  message: string = '';
  constructor(private testService: TestService, private uiService: UiService) {}

  ngOnInit() {
    this.testService.getTestMessage().subscribe({
      next: data => {
        this.message = data.message;
      },
      error: err => {
        this.uiService.showSnackbar('Please try to relogin.', 'Close', 3000);
      }
    });
  }
}
