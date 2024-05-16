import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  authForm: FormGroup;
  revealPassword = false;

  constructor(private fb: FormBuilder){
    this.authForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required)
    })
  }

  OnSubmit(): void{
    if(this.authForm.invalid){
      this.authForm.markAllAsTouched();
    }else{
      console.log(this.authForm.value);
    }
  }
}
