import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from '@abp/ng.core';
import {PasswordModule} from 'primeng/password';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AuthRoutingModule,
        PasswordModule
    ]
})
export class AuthModule { }
