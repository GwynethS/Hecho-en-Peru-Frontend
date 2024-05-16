import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signUpForm: FormGroup;
  revealPassword = false;

  constructor(private fb: FormBuilder){
    this.signUpForm = this.fb.group({
      name: this.fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('[a-zA-Z\\s]*')
      ]),
      lastName: this.fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('[a-zA-Z\\s]*')
      ]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required)
    })
  }

  OnSubmit(): void{
    if(this.signUpForm.invalid){
      this.signUpForm.markAllAsTouched();
    }else{
      console.log(this.signUpForm.value);
    }
  }
}
