import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMsgComponent as ValidationMsgComponent } from './validation-msg.component';
import { NbBadgeModule } from '@nebular/theme';

@NgModule({
  imports: [
    CommonModule,
    NbBadgeModule
  ],
  declarations: [ValidationMsgComponent],
  exports: [ValidationMsgComponent]
})
export class ValidationMsgModule { }
