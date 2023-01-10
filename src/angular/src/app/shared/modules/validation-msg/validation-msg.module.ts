import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMsgComponent as ValidationMsgComponent } from './validation-msg.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [ValidationMsgComponent],
  exports: [ValidationMsgComponent]
})
export class ValidationMsgModule { }
