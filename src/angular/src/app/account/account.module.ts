import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@abp/ng.core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './account.component';
import { AccountoutingModule } from './account-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { LoginComponent } from './login/login.component';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
} from '@nebular/theme';
import { ValidationMessageModule } from '../shared/modules';
@NgModule({
  declarations: [AccountComponent, LoginComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    AccountoutingModule,
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    NbIconModule,
    ValidationMessageModule,
  ],
  exports: [AccountComponent, LoginComponent],
})
export class AccountModule {}
