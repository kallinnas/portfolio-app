import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralModule } from '../modules/general.model';
import { AuthService } from '../services/auth.service';
import { UserRegistrDto } from '../model/user.model';
import { UiService } from '../services/ui.service';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  errorMessage = '';
  isRegisterMode: boolean = false;
  authForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initialForm();

    if (this.authService.afterRefreshToken) {
      this.uiService.showSnackbar('Session has been expired. Relogin please.', '', 3000);
    }
  }

  initialForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['']
    });
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    if (this.isRegisterMode) {
      const user = new UserRegistrDto(this.authForm.value.email, this.authForm.value.password, this.authForm.value.name);
      this.authService.register(user);
    }

    else {
      this.authService.login(this.authForm.value.email, this.authForm.value.password);
    }
  }

  toggleMode() { this.isRegisterMode = !this.isRegisterMode; }

}
