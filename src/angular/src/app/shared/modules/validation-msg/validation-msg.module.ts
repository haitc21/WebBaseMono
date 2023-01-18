import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessageComponent as ValidationMessageComponent } from './validation-msg.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  imports: [CommonModule, MessagesModule, MessageModule],
  declarations: [ValidationMessageComponent],
  exports: [ValidationMessageComponent],
})
export class ValidationMessageModule {}
