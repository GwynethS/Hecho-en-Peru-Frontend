import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  editProfileForm: FormGroup;
  revealPassword = false;

  constructor(private fb: FormBuilder){
    this.editProfileForm = this.fb.group({
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
      email: this.fb.control({value: '', disabled: true}),
      password: this.fb.control('', Validators.required)
    })
  }

  OnSubmit(): void{
    if(this.editProfileForm.invalid){
      this.editProfileForm.markAllAsTouched();
    }else{
      console.log(this.editProfileForm.value);
    }
  }

  OnDelete(): void{
    console.log("Cuenta eliminada");
  }
}
