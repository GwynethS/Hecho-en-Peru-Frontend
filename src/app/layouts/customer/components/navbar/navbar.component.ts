import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  categorySearchForm: FormGroup;

  constructor(private fb: FormBuilder,){
    this.categorySearchForm = this.fb.group({
      category: this.fb.control('', [Validators.required, Validators.pattern('[a-zA-Z]*')])
    });
  }

  onCreate(): void{
    if(this.categorySearchForm.invalid){
      this.categorySearchForm.markAllAsTouched();
    }else{
      console.log(this.categorySearchForm.value);
    }
  }
}
