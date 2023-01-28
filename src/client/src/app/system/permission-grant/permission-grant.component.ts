import { LocalizationService } from '@abp/ng.core';
import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RolesService } from '@proxy/roles';
import {
  GetPermissionListResultDto,
  PermissionGrantInfoDto,
  PermissionGroupDto,
  UpdatePermissionDto,
  UpdatePermissionsDto,
} from '@proxy/volo/abp/permission-management';
import { SelectItemGroup } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ROLE_PROVIDER } from 'src/app/shared/constants/provider-namex.const';

@Component({
  templateUrl: 'permission-grant.component.html',
})
export class PermissionGrantComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  // Default
  public blockedPanelDetail: boolean = false;
  public form: FormGroup;
  public title: string;
  public btnDisabled = false;
  public closeBtnName: string;
  public groups: PermissionGroupDto[] = [];
  public permissions: PermissionGrantInfoDto[] = [];
  public selectedPermissions: string[] = [];
  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

  groupedPermisssions: SelectItemGroup[] = [];
  pnlHeader: string = '';

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private roleService: RolesService,
    private fb: FormBuilder,
    protected localizationService: LocalizationService
  ) {}

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.loadDetail(this.config.data.providerName, this.config.data.providerKey);
  }

  loadDetail(providerName: string, providerKey: string) {
    this.toggleBlockUI(true);
    let grs = [];
    this.roleService
      .getPermissions(providerName, providerKey)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: GetPermissionListResultDto) => {
          console.log(response);
          
          this.groups = response.groups;
          this.groups.forEach(grPm => {
            let gr = {
              label: grPm.displayName,
              value: grPm.name,
              items: [],
            };
            grPm.permissions.forEach(pm => {
              this.permissions.push(pm);
              gr.items.push({
                label: grPm.name != 'AbpIdentity' ? pm.displayName : this.localizationService.instant(`::Permission:${pm.name}`),
                value: pm.name,
              });
            });
            grs.push(gr);
          });
          console.log(grs);
          
          this.groupedPermisssions = grs;
          this.fillValue();
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }
  saveChange() {
    this.toggleBlockUI(true);
    this.saveData();
  }

  private saveData() {
    let permissions: UpdatePermissionDto[] = [];
    for (let index = 0; index < this.permissions.length; index++) {
      const isGranted =
        this.selectedPermissions.filter(x => x == this.permissions[index].name).length > 0;
      permissions.push({ name: this.permissions[index].name, isGranted: isGranted });
    }
    let updateValues: UpdatePermissionsDto = {
      permissions: permissions,
    };
    this.roleService
      .updatePermissions(this.config.data.providerName, this.config.data.providerKey, updateValues)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.toggleBlockUI(false);
        this.ref.close('ok');
      });
  }

  fillValue() {
    //Fill value
    for (let index = 0; index < this.groups.length; index++) {
      const group = this.groups[index];
      for (let jIndex = 0; jIndex < group.permissions.length; jIndex++) {
        const permission = group.permissions[jIndex];
        if (permission.isGranted) {
          this.selectedPermissions.push(permission.name);
        }
      }
    }
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.btnDisabled = true;
      this.blockedPanelDetail = true;
    } else {
      setTimeout(() => {
        this.btnDisabled = false;
        this.blockedPanelDetail = false;
      }, 200);
    }
  }
}
