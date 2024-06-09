import { Pipe, PipeTransform } from '@angular/core';
import { LoginResponse } from '../../layouts/customer/pages/auth/models/login-response';

@Pipe({
  name: 'fullNameUserLogin'
})
export class FullNameUserLoginPipe implements PipeTransform {

  transform(value: LoginResponse | null, ...args: unknown[]): unknown {
    if(value){
      return value.user.name + ' ' + value.user.lastName;
    }else{
      return 'Usuario';
    }
  }

}
