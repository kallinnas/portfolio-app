import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestService } from './test.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'main-portfolio-app';

  message: string = '';

  constructor(private testService: TestService) {}

  ngOnInit() {
    this.testService.getTestMessage().subscribe(data => {
      this.message = data.message;
    });
  }
}
