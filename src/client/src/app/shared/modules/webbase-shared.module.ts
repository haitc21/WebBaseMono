import { CoreModule } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ValidationMessageComponent } from './validation-message/validation-message.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MapComponent } from './map/map.component';

@NgModule({
  imports: [CoreModule, CommonModule, MessagesModule, MessageModule],
  declarations: [ValidationMessageComponent,MapComponent],
  exports: [ValidationMessageComponent,MapComponent],
})
export class WebBaseSharedModule {}
