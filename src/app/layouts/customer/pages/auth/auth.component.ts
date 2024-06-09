import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  authForm: FormGroup;
  revealPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.authForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required),
    });
  }

  OnSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
    } else {
      this.authService.logIn(this.authForm.value).subscribe({
        error: () => {
          this.alertService.showError('Ups! Ocurrió un problema', 'El email o la constraseña son incorrectos');
        },
      });
    }
  }
}
