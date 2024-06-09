import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { ErrorsFeedbackPipe } from './pipes/errors-feedback.pipe';


@NgModule({
  declarations: [
    ErrorsFeedbackPipe
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    ErrorsFeedbackPipe
  ]
})
export class SharedModule { }
