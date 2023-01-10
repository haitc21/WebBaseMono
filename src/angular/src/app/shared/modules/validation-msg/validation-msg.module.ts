import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMsgComponent as ValidationMsgComponent } from './validation-msg.component';
import { NbAlertModule } from '@nebular/theme';

@NgModule({
  imports: [
    CommonModule,
    NbAlertModule
  ],
  declarations: [ValidationMsgComponent],
  exports: [ValidationMsgComponent]
})
export class ValidationMsgModule { }
