import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { LoginResponse } from '../../../layouts/customer/pages/auth/models/login-response';

export const AuthAction = createActionGroup({
  source: 'Auth',
  events: {
    'Set auth user': props<{user: LoginResponse}>(),
    'Logout': emptyProps(),
  }
})