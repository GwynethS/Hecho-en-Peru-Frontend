import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { UserLogin } from "../../../layouts/customer/pages/auth/models/user-login";

export const AuthAction = createActionGroup({
  source: 'Auth',
  events: {
    'Set auth user': props<{user: UserLogin}>(),
    'Logout': emptyProps(),
  }
})