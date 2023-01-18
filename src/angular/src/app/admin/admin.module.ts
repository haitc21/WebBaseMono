import { NgModule } from '@angular/core';
import { NbCardModule, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule, ValidationMessageModule } from '../shared/modules';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardModule } from './components/dashboard/dashboard.module';

import { CalendarModule } from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EditorModule } from 'primeng/editor';
import { ImageModule } from 'primeng/image';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PickListModule } from 'primeng/picklist';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PermissionGrantComponent } from './components/role/permission-grant.component';
import { RoleDetailComponent } from './components/role/role-detail.component';
import { RoleComponent } from './components/role/role.component';
import { CoreModule } from '@abp/ng.core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    CoreModule,
    AdminRoutingModule,   
     FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    MiscellaneousModule,

    NbCardModule,
    Ng2SmartTableModule,

    CalendarModule,
    PanelModule,
    TableModule,
    PaginatorModule,
    BlockUIModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    ProgressSpinnerModule,
    DynamicDialogModule,
    InputNumberModule,
    CheckboxModule,
    InputTextareaModule,
    EditorModule,
    BadgeModule,
    ImageModule,
    ConfirmDialogModule,
    PickListModule,
    KeyFilterModule,
    ValidationMessageModule
  ],
  declarations: [AdminComponent, PermissionGrantComponent, RoleDetailComponent, RoleComponent],
})
export class AdminModule {}
