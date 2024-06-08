import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { LoginResponse } from '../../../auth/models/login-response';
import { UserProfile } from './models/user-profile';
import { CustomersService } from '../../../../../admin/pages/customers/customers.service';
import { Store } from '@ngrx/store';
import { AuthAction } from '../../../../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  editProfileForm: FormGroup;
  revealPassword = false;

  authUserData: LoginResponse | null;
  changePassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private customersService: CustomersService,
    private store: Store
  ) {
    this.editProfileForm = this.fb.group({
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
      email: this.fb.control({ value: '', disabled: true }),
      newPassword: this.fb.control('', Validators.minLength(8)),
      password: this.fb.control(''),
    });

    this.authUserData = this.authService.getAuthUser();
    if (this.authUserData)
      this.editProfileForm.patchValue({
        ...this.authUserData?.user,
        password: '',
      });
  }

  onSubmit(): void {
    if (this.editProfileForm.invalid) {
      this.editProfileForm.markAllAsTouched();
    } else {
      const editUserData: UserProfile = {
        ...this.editProfileForm.value,
      };
      if (!editUserData.newPassword) editUserData.password = '';
      console.log(editUserData);
      if (this.authUserData) {
        this.customersService
          .updateUser(editUserData, this.authUserData.user.id)
          .subscribe({
            next: (user) => {
              if (this.authUserData) {
                const updatedUser = {
                  user: { ...this.authUserData.user, ...user },
                  jwtResponse: this.authUserData.jwtResponse,
                };
                this.authService.updateAuthUser(updatedUser);
                console.log('Usuario actualizado');
              }
            },
          });
      }
    }
  }

  onDelete(): void {
    if (this.authUserData)
      this.customersService.deleteUser(this.authUserData.user.id).subscribe();
    console.log('Cuenta eliminada');
  }

  onChangePasswordInput(e: any) {
    const password = e.target.value;
    if (password) this.changePassword = true;
    else this.changePassword = false;

    if (this.changePassword) {
      if (!this.editProfileForm.get('password')?.value) {
        this.editProfileForm.get('password')?.setErrors({ required: true });
        this.editProfileForm.markAllAsTouched();
      }
    } else {
      this.editProfileForm.get('password')?.setErrors(null);
    }
  }
}
