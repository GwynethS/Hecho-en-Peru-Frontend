import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { LoginResponse } from '../../../auth/models/login-response';
import { UserProfile } from './models/user-profile';
import { CustomersService } from '../../../../../admin/pages/customers/customers.service';
import { AlertService } from '../../../../../../core/services/alert.service';
import { Subscription } from 'rxjs';

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

  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private customersService: CustomersService,
    private alertService: AlertService
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

      this.alertService
        .showConfirmAction(
          '¿Estás seguro que deseas continuar?',
          'Se guardarán los cambios realizados',
          'Continuar'
        )
        .then((result) => {
          if (result.isConfirmed && this.authUserData) {
            this.subscriptions.push(
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
                      this.alertService.showSuccess(
                        '¡Operación exitosa!',
                        'Los datos se actualizaron correctamente'
                      );
                    }
                  },
                  error: () =>
                    this.alertService.showError(
                      'Ups! Ocurrió un problema',
                      'No se pudieron actualizar los datos'
                    ),
                })
            );
          }
        });
    }
  }

  onDelete(): void {
    this.alertService
      .showConfirmAction(
        '¿Estás seguro que deseas continuar?',
        'Esta acción no se puede revertir',
        'Continuar'
      )
      .then((result) => {
        if (result.isConfirmed && this.authUserData) {
          this.subscriptions.push(
            this.customersService
              .deleteUser(this.authUserData.user.id)
              .subscribe({
                next: () =>
                  this.alertService.showSuccess(
                    '¡Operación exitosa!',
                    'La cuenta fue eliminada correctamente'
                  ),
                error: () =>
                  this.alertService.showError(
                    'Ups! Ocurrió un problema',
                    'No se pudo eliminar la cuenta'
                  ),
              })
          );
        }
      });
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

  OnDestroy(){
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }
}
