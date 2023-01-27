import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
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
import { WebBaseSharedModule } from '../shared/modules/webbase-shared.module';
import { BadgeModule } from 'primeng/badge';
import { ImageModule } from 'primeng/image';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { RoleComponent } from './role/role.component';
import { RoleDetailComponent } from './role/detail/role-detail.component';
import { PermissionGrantComponent } from './permission-grant/permission-grant.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user/user-detail.component';
import { SystemRoutingModule } from './system-routing.module';
import { RoleAssignComponent } from './user/role-assign.component';
import { PickListModule } from 'primeng/picklist';
import { SetPasswordComponent } from './user/set-password.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { ListboxModule } from 'primeng/listbox';
import { TooltipModule } from 'primeng/tooltip';
import { TieredMenuModule } from 'primeng/tieredmenu';

@NgModule({
  declarations: [
    RoleComponent,
    RoleDetailComponent,
    PermissionGrantComponent,
    UserComponent,
    UserDetailComponent,
    RoleAssignComponent,
    SetPasswordComponent,
  ],
  imports: [
    SharedModule,
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
    WebBaseSharedModule,
    BadgeModule,
    ImageModule,
    ConfirmDialogModule,
    CalendarModule,
    SystemRoutingModule,
    PickListModule,
    KeyFilterModule,
    ToolbarModule,
    TagModule,
    ListboxModule,
    TooltipModule,
    TieredMenuModule
  ],
  entryComponents: [
    RoleDetailComponent,
    PermissionGrantComponent,
    UserDetailComponent,
    RoleAssignComponent,
    SetPasswordComponent,
  ],
})
export class SystemModule {}
