import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { RoleDto, RolesService } from '@proxy/roles';
import { UserDto, UsersService } from '@proxy/users';
import { IdentityUserDto, IdentityUserUpdateRolesDto } from '@proxy/volo/abp/identity/models';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';

@Component({
  templateUrl: './role-assign.component.html',
})
export class RoleAssignComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  // Default
  public blockedPanelDetail: boolean = false;
  public title: string;
  public btnDisabled = false;
  public closeBtnName: string;
  public availableRoles: RoleDto[] = [];
  public seletedRoles: RoleDto[] = [];
  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UsersService,
    private roleService: RolesService
  ) {}

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.loadRoles();
  }
  loadRoles() {
    this.toggleBlockUI(true);
    var roles = this.roleService.getListAll();
    forkJoin({
      roles,
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (repsonse: any) => {
          var roles = repsonse.roles as RoleDto[];
          this.availableRoles = [...roles];
          this.loadDetail(this.config.data.id);
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }
  loadDetail(id: any) {
    this.toggleBlockUI(true);
    this.userService
      .getIncludeRole(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: UserDto) => {
          this.seletedRoles = this.availableRoles.filter(x => response.roles.includes(x.name));
          this.availableRoles = this.availableRoles.filter(
            x => x.isPublic && !response.roles.includes(x.name)
          );
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  saveChange() {
    this.toggleBlockUI(true);
    let roleNames = this.seletedRoles.map(x => x.name);
    let updateRoleDto: IdentityUserUpdateRolesDto = { roleNames: [...roleNames] };
    this.userService
      .updateRoles(this.config.data.id, updateRoleDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.ref.close(this.seletedRoles);
          this.toggleBlockUI(false);
        },
        () => {
          this.toggleBlockUI(false);
        }
      );
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.btnDisabled = true;
      this.blockedPanelDetail = true;
    } else {
      setTimeout(() => {
        this.btnDisabled = false;
        this.blockedPanelDetail = false;
      }, 300);
    }
  }
}
