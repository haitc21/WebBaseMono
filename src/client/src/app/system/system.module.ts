import { NgModule } from '@angular/core';
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
import { BadgeModule } from 'primeng/badge';
import { ImageModule } from 'primeng/image';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { RoleComponent } from './role/role.component';
import { RoleDetailComponent } from './role/detail/role-detail.component';
import { PermissionGrantComponent } from './permission-grant/permission-grant.component';
import { UserComponent } from './user/user.component';
import { SystemRoutingModule } from './system-routing.module';
import { PickListModule } from 'primeng/picklist';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { ListboxModule } from 'primeng/listbox';
import { TooltipModule } from 'primeng/tooltip';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { UserDetailComponent } from './user/detail/user-detail.component';
import { RoleAssignComponent } from './user/role-assign/role-assign.component';
import { SetPasswordComponent } from './user/set-password/set-password.component';
import { CoreModule } from '@abp/ng.core';
import { PasswordModule } from 'primeng/password';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';
import { WebBaseSharedModule } from '../shared/modules/webbase-shared.module';

const COMPONENT = [
  RoleComponent,
  RoleDetailComponent,
  PermissionGrantComponent,
  UserComponent,
  UserDetailComponent,
  RoleAssignComponent,
  SetPasswordComponent,
];

@NgModule({
  declarations: [...COMPONENT],
  imports: [
    CoreModule,
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
    TieredMenuModule,
    PasswordModule,
    OverlayPanelModule,
    CardModule,
  ],
  entryComponents: [...COMPONENT],
})
export class SystemModule {}
