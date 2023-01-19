import { CoreModule } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ValidationMessageComponent } from './validation-message/validation-message.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  imports: [CoreModule, CommonModule, MessagesModule, MessageModule],
  declarations: [ValidationMessageComponent],
  exports: [ValidationMessageComponent],
})
export class WebBaseSharedModule {}
