import { Component } from '@angular/core';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  message: string = '';
  constructor(private testService: TestService) {}
  ngOnInit() {
    this.testService.getTestMessage().subscribe(data => {
      this.message = data.message;
    });
  }
}
