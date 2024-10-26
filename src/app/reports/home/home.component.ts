import { Component } from '@angular/core';
import { TestService } from '../../services/test.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  message: string = '';
  constructor(private testService: TestService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.testService.getTestMessage().subscribe({
      next: data => {
        this.message = data.message;
      },
      error: err => {
        this.snackBar.open('Error retrieving data. Please try again later.', 'Close', { duration: 3000 });
      }
    });
  }
}
