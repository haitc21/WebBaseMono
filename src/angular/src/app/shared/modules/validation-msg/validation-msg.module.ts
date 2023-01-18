import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMsgComponent as ValidationMsgComponent } from './validation-msg.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  imports: [CommonModule, MessagesModule, MessageModule],
  declarations: [ValidationMsgComponent],
  exports: [ValidationMsgComponent],
})
export class ValidationMsgModule {}
