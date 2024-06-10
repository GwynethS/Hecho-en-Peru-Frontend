import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../../admin/pages/customers/customers.service';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../../core/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  signUpForm: FormGroup;
  revealPassword = false;

  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      name: this.fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('[a-zA-Z\\s]*'),
      ]),
      lastName: this.fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('[a-zA-Z\\s]*'),
      ]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
    } else {
      this.subscriptions.push(
        this.customersService.createUser(this.signUpForm.value).subscribe({
          next: () => {
            this.alertService
              .showSuccesActionWaitResponse(
                '¡Bienvenido a Hecho en Perú!',
                'Ahora eres parte de la familia',
                'Iniciar sesión'
              )
              .then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/shop/auth']);
                }else{
                  this.router.navigate(['/shop']);
                }
              });
          },
          error: () => {
            this.alertService.showError(
              'Ups! Ocurrió un problema',
              'Uno o más datos ingresados no son correctos'
            );
          },
        })
      );
    }
  }

  OnDestroy(){
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }
}
