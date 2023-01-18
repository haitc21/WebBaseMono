import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from '@abp/ng.core';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AuthRoutingModule
    ]
})
export class AuthModule { }
