import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { ErrorsFeedbackPipe } from './pipes/errors-feedback.pipe';
import { FullNameUserLoginPipe } from './pipes/full-name-user-login.pipe';


@NgModule({
  declarations: [
    ErrorsFeedbackPipe,
    FullNameUserLoginPipe
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    ErrorsFeedbackPipe,
    FullNameUserLoginPipe
  ]
})
export class SharedModule { }
