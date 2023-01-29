import { PagedResultDto, PermissionService } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoleDto, RolesService } from '@proxy/roles';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { MessageConstants } from 'src/app/shared/constants/messages.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PermissionGrantComponent } from '../permission-grant/permission-grant.component';
import { RoleDetailComponent } from './detail/role-detail.component';
import { DIALOG_MD, DIALOG_SM } from 'src/app/shared/constants/sizes.const';
import { ROLE_PROVIDER } from 'src/app/shared/constants/provider-namex.const';
import { Actions } from 'src/app/shared/enums/actions.enum';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit, OnDestroy {
  //System variables
  private ngUnsubscribe = new Subject<void>();
  public blockedPanel: boolean = false;

  //Paging variables
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount: number;
  Actions = Actions;

  //Business variables
  public items: RoleDto[];
  public selectedItems: RoleDto[] = [];
  public keyword: string = '';

  hasPermissionUpdate = false;
  hasPermissionDelete = false;
  hasPermissionManagementPermionsion = false;
  visibleActionMenu = false;

  constructor(
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
    this.getpermission();
    this.loadData();
  }
   getpermission() {
    this.hasPermissionUpdate = this.permissionService.getGrantedPolicy('AbpIdentity.Users.Update');
    this.hasPermissionDelete = this.permissionService.getGrantedPolicy('AbpIdentity.Users.Update');
    this.hasPermissionManagementPermionsion = this.permissionService.getGrantedPolicy('AbpIdentity.Users.ManagePermissions');
    this.visibleActionMenu =   this.hasPermissionUpdate || this.hasPermissionDelete || this.hasPermissionManagementPermionsion
  }

  loadData() {
    this.toggleBlockUI(true);

    this.roleService
      .getListFilter({
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
        keyword: this.keyword,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<RoleDto>) => {
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
    const ref = this.dialogService.open(RoleDetailComponent, {
      header: 'Tạo vai trò',
      width: DIALOG_SM,
    });

    ref.onClose.subscribe((data: RoleDto) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
        this.selectedItems = [];
        this.loadData();
      }
    });
  }

  pageChanged(event: any): void {
    this.skipCount = event.page * this.maxResultCount;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showEditModal(row: any) {
    if (!row) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const ref = this.dialogService.open(RoleDetailComponent, {
      data: {
        id: row.id,
      },
      header: `Cập nhật vai trò '${row.name}'`,
      width: DIALOG_SM,
    });

    ref.onClose.subscribe((data: RoleDto) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
        this.selectedItems = [];
        this.loadData();
      }
    });
  }
  showPermissionModal(row) {
    if (!row) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const ref = this.dialogService.open(PermissionGrantComponent, {
      data: {
        providerKey: row.name,
        providerName: ROLE_PROVIDER,
      },
      header: `Phân quyền cho vai trò '${row.name}'`,
      width: DIALOG_SM,
    });

    ref.onClose.subscribe((data: any) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
        this.selectedItems = [];
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

    this.roleService.deleteMultiple(ids).subscribe({
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

  deleteRow(item) {
    if (!item) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    this.confirmationService.confirm({
      message: MessageConstants.CONFIRM_DELETE_MSG,
      accept: () => {
        this.deleteRowConfirm(item.id);
      },
    });
  }
  deleteRowConfirm(id) {
    this.toggleBlockUI(true);

    this.roleService.delete(id).subscribe({
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
