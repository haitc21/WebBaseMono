import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@abp/ng.core';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './account.component';
import { AccountoutingModule } from './account-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { LoginComponent } from './login/login.component';
@NgModule({
  declarations: [AccountComponent,LoginComponent],
  imports: [
    CommonModule,
    CoreModule,
    ThemeSharedModule,
    FormsModule,
    ReactiveFormsModule,
    AccountoutingModule,
    ThemeModule
  ],
  exports: [AccountComponent,LoginComponent],
})
export class AccountModule {}
