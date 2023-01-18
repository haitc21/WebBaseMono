import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoleDto,  RolesService } from '@proxy/roles';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { PermissionGrantComponent } from './permission-grant.component';
import { RoleDetailComponent } from './role-detail.component';
import { Consts, MessageConstants } from 'src/app/shared/consts';
import { NbToastrService } from '@nebular/theme';
import { Util } from 'src/app/shared/utilities';
import { ToastType } from 'src/app/shared/enums';

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

  //Business variables
  public items: RoleDto[];
  public selectedItems: RoleDto[] = [];
  public keyword: string = '';

  constructor(
    private roleService: RolesService,
    public dialogService: DialogService,
    private toastrService: NbToastrService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(selectionId = null) {
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
          if (selectionId != null && this.items.length > 0) {
            this.selectedItems = this.items.filter(x => x.id == selectionId);
          }

          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  showAddModal() {
    const ref = this.dialogService.open(RoleDetailComponent, {
      header: 'Thêm mới quyền',
      width: '70%',
    });

    ref.onClose.subscribe((data: RoleDto) => {
      if (data) {
        this.toastrService.show(
          MessageConstants.CREATED_OK_MSG,
          Consts.TOAST_SUCCESS_TITILE,
          Util.configDefaultToast(ToastType.success)
        );
        this.selectedItems = [];
        this.loadData();
      }
    });
  }

  pageChanged(event: any): void {
    this.skipCount = (event.page - 1) * this.maxResultCount;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showEditModal() {
    if (this.selectedItems.length == 0) {
      this.toastrService.show(
        MessageConstants.NOT_CHOOSE_ANY_RECORD,
        Consts.TOAST_DANGER_TITILE,
        Util.configDefaultToast(ToastType.danger)
      );
      return;
    }
    var id = this.selectedItems[0].id;
    const ref = this.dialogService.open(RoleDetailComponent, {
      data: {
        id: id,
      },
      header: 'Cập nhật quyền',
      width: '70%',
    });

    ref.onClose.subscribe((data: RoleDto) => {
      if (data) {
        this.toastrService.show(
          MessageConstants.UPDATED_OK_MSG,
          Consts.TOAST_SUCCESS_TITILE,
          Util.configDefaultToast(ToastType.success)
        );
        this.selectedItems = [];
        this.loadData(data.id);
      }
    });
  }
  showPermissionModal(id: string, name: string) {
    const ref = this.dialogService.open(PermissionGrantComponent, {
      data: {
        id: id,
        name: name,
      },
      header: name,
      width: '70%',
    });

    ref.onClose.subscribe((data: RoleDto) => {
      if (data) {
        this.toastrService.show(
          MessageConstants.UPDATED_OK_MSG,
          Consts.TOAST_SUCCESS_TITILE,
          Util.configDefaultToast(ToastType.success)
        );
        this.selectedItems = [];
        this.loadData(data.id);
      }
    });
  }
  deleteItems() {
    if (this.selectedItems.length == 0) {
      this.toastrService.show(
        MessageConstants.NOT_CHOOSE_ANY_RECORD,
        Consts.TOAST_DANGER_TITILE,
        Util.configDefaultToast(ToastType.danger)
      );
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
        this.toastrService.show(
          MessageConstants.DELETED_OK_MSG,
          Consts.TOAST_SUCCESS_TITILE,
          Util.configDefaultToast(ToastType.success)
        );
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
      }, 1000);
    }
  }
}
