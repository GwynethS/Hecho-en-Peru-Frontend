import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../../admin/pages/customers/customers.service';
import { Subscription } from 'rxjs';

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
    private customersService: CustomersService
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
      password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
    });
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
    } else {
      this.subscriptions.push(
        this.customersService.createUser(this.signUpForm.value).subscribe({
          next: (user) => {
            console.log(user);
          },
        })
      );
    }
  }
}
