import { PagedResultDto, PermissionService } from '@abp/ng.core';
import {
  GetIdentityUsersInput,
  IdentityUserCreateDto,
  IdentityUserDto,
  IdentityUserUpdateDto,
} from '@abp/ng.identity/proxy';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoleLookupDto, RolesService } from '@proxy/roles';
import { GetUserListDto, UsersService } from '@proxy/users';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { MessageConstants } from 'src/app/shared/constants/messages.const';
import { USER_PROVIDER } from 'src/app/shared/constants/provider-namex.const';
import { DIALOG_MD, DIALOG_SM } from 'src/app/shared/constants/sizes.const';
import { Actions } from 'src/app/shared/enums/actions.enum';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PermissionGrantComponent } from '../permission-grant/permission-grant.component';
import { UserDetailComponent } from './detail/user-detail.component';
import { RoleAssignComponent } from './role-assign/role-assign.component';
import { SetPasswordComponent } from './set-password/set-password.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  //System variables
  private ngUnsubscribe = new Subject<void>();
  public blockedPanel: boolean = false;

  //Paging variables
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount: number;
  Actions = Actions;

  //Business variables
  public items: IdentityUserDto[];
  public selectedItems: IdentityUserDto[] = [];
  public keyword: string = '';
  filter: GetUserListDto;
  emailSearch: string = '';
  phoneNumberSearch: string = '';
  roleIdSearch: string = '';

  roleOptions: RoleLookupDto[] = [];

  actionMenu: MenuItem[];
  actionItem: IdentityUserDto;

  hasPermissionUpdate = false;
  hasPermissionDelete = false;
  hasPermissionManagementPermionsion = false;
  visibleActionColumn = false;

  constructor(
    private userService: UsersService,
    private roleService: RolesService,
    public dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionService
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.getPermission();
    this.buildActionMenu();
    this.loadOptions();
    this.loadData();
  }
  loadOptions() {
    this.toggleBlockUI(true);
    this.roleService
      .getRoleLookup()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          this.roleOptions = res.items;
          this.toggleBlockUI(false);
        },
        () => {
          this.toggleBlockUI(false);
        }
      );
  }
  getPermission() {
    this.hasPermissionUpdate = this.permissionService.getGrantedPolicy('AbpIdentity.Users.Update');
    this.hasPermissionDelete = this.permissionService.getGrantedPolicy('AbpIdentity.Users.Update');
    this.hasPermissionManagementPermionsion = this.permissionService.getGrantedPolicy(
      'AbpIdentity.Users.ManagePermissions'
    );
    this.visibleActionColumn =
      this.hasPermissionUpdate ||
      this.hasPermissionDelete ||
      this.hasPermissionManagementPermionsion;
  }

  buildActionMenu() {
    this.actionMenu = [
      {
        label: this.Actions.UPDATE,
        icon: 'pi pi-fw pi-pencil',
        command: event => {
          this.showEditModal(this.actionItem);
          this.actionItem = null;
        },
        visible: this.hasPermissionUpdate,
      },
      {
        label: this.Actions.ASSIGN_ROLE,
        icon: 'pi pi-fw pi-user-edit',
        command: event => {
          this.assignRole(this.actionItem);
          this.actionItem = null;
        },
        visible: this.hasPermissionUpdate,
      },
      {
        label: this.Actions.MANAGE_PERMISSIONS,
        icon: 'pi pi-fw pi-wrench',
        command: event => {
          this.showPermissionModal(this.actionItem);
          this.actionItem = null;
        },
        visible: this.hasPermissionManagementPermionsion,
      },
      {
        label: this.Actions.SET_PASSWORD,
        icon: 'pi pi-fw pi-key',
        command: event => {
          this.setPassword(this.actionItem);
          this.actionItem = null;
        },
        visible: this.hasPermissionUpdate,
      },
      {
        label: this.Actions.DELETE,
        icon: 'pi pi-fw pi-trash',
        command: event => {
          this.deleteRow(this.actionItem);
          this.actionItem = null;
        },
        visible: this.hasPermissionDelete,
      },
    ];
  }
  setActionItem(item) {
    this.actionItem = item;
  }

  loadData() {
    this.toggleBlockUI(true);
    this.filter = {
      filter: this.keyword,
      skipCount: this.skipCount,
      maxResultCount: this.maxResultCount,
      email: this.emailSearch,
      phoneNumber: this.phoneNumberSearch,
      roleId: this.roleIdSearch
    };
    this.userService
      .getListFilter(this.filter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<IdentityUserDto>) => {
          this.items = response.items;
          this.totalCount = response.totalCount;
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  showAddModal() {
    const ref = this.dialogService.open(UserDetailComponent, {
      header: 'Tạo mới người dùng',
      width: DIALOG_MD,
    });

    ref.onClose.subscribe((data: IdentityUserCreateDto) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
        this.selectedItems = [];
        this.actionItem = null;
        this.loadData();
      }
    });
  }

  pageChanged(event: any): void {
    this.skipCount = event.page * this.maxResultCount;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showEditModal(row) {
    if (!row) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const ref = this.dialogService.open(UserDetailComponent, {
      data: {
        id: row.id,
      },
      header: `Cập nhật người dùng '${row.userName}'`,
      width: DIALOG_MD,
    });

    ref.onClose.subscribe((data: IdentityUserUpdateDto) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
        this.selectedItems = [];
        this.actionItem = null;
        this.loadData();
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    var ids = [];
    this.selectedItems.forEach(element => {
      ids.push(element.id);
    });
    this.confirmationService.confirm({
      message: MessageConstants.CONFIRM_DELETE_MSG,
      accept: () => {
        this.deleteItemsConfirm(ids);
      },
    });
  }

  deleteItemsConfirm(ids: any[]) {
    this.toggleBlockUI(true);
    this.userService.deleteMultiple(ids).subscribe({
      next: () => {
        this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
        this.loadData();
        this.selectedItems = [];
        this.toggleBlockUI(false);
      },
      error: () => {
        this.toggleBlockUI(false);
      },
    });
  }

  setPassword(row) {
    if (!row) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const ref = this.dialogService.open(SetPasswordComponent, {
      data: {
        id: row.id,
      },
      header: `Đặt lại mật khẩu cho người dùng '${row.userName}'`,
      width: DIALOG_SM,
    });

    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.notificationService.showSuccess(MessageConstants.CHANGE_PASSWORD_SUCCCESS_MSG);
        this.selectedItems = [];
        this.actionItem = null;
        this.loadData();
      }
    });
  }

  assignRole(row) {
    if (!row) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const ref = this.dialogService.open(RoleAssignComponent, {
      data: {
        id: row.id,
      },
      header: `Quản lý vai trò của người dùng '${row.userName}'`,
      width: DIALOG_MD,
    });

    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.notificationService.showSuccess(MessageConstants.ROLE_ASSIGN_SUCCESS_MSG);
        this.actionItem = null;
        this.loadData();
      }
    });
  }

  deleteRow(row) {
    if (!row) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    this.confirmationService.confirm({
      message: MessageConstants.CONFIRM_DELETE_MSG,
      accept: () => {
        this.deleteRowConfirm(row.id);
      },
    });
  }
  deleteRowConfirm(id) {
    this.toggleBlockUI(true);

    this.userService.delete(id).subscribe({
      next: () => {
        this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
        this.loadData();
        this.selectedItems = [];
        this.actionItem = null;
        this.toggleBlockUI(false);
      },
      error: () => {
        this.toggleBlockUI(false);
      },
    });
  }

  showPermissionModal(row) {
    if (!row) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const ref = this.dialogService.open(PermissionGrantComponent, {
      data: {
        providerKey: row.id,
        providerName: USER_PROVIDER,
      },
      header: `Phân quyền cho người dùng '${row.userName}'`,
      width: DIALOG_SM,
    });

    ref.onClose.subscribe((data: any) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
        this.selectedItems = [];
        this.actionItem = null;
        this.loadData();
      }
    });
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 200);
    }
  }
}
