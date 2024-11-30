import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import { AccessTokenService } from '../services/token/access-token.service';
import { GeneralModule } from '../modules/general.model';
import { AuthService } from '../services/auth.service';
import { UserRegistrDto } from '../model/user.model';
import { UiService } from '../services/ui.service';


@Component({
  selector: 'app-auth', standalone: true,
  imports: [GeneralModule],
  templateUrl: './auth.component.html', styleUrl: './auth.component.scss'
})
export class AuthComponent {

  errorMessage = '';
  isRegisterMode: boolean = false;
  authForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    public authService: AuthService,
    private accessTokenService: AccessTokenService,
  ) { }

  ngOnInit(): void {
    this.initialForm();

    if (this.accessTokenService.afterRefreshToken) {
      this.uiService.showSnackbar('Session has been expired. Relogin please.');
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

    const formValues = { ...this.authForm.value };

    formValues.email = formValues.email?.trim();
    formValues.password = formValues.password?.trim();
    formValues.name = formValues.name?.trim();

    if (this.isRegisterMode) {
      this.authService.register(new UserRegistrDto(formValues));
    }

    else {
      this.authService.login(formValues.email, formValues.password);
    }
  }

  toggleMode() { this.isRegisterMode = !this.isRegisterMode; }

}
