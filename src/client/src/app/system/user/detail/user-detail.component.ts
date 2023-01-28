import { Component, OnInit, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersService } from '@proxy/users';
import { RoleDto, RolesService } from '@proxy/roles';
import { IdentityUserDto } from '@abp/ng.identity/proxy';

@Component({
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  // Default
  public blockedPanelDetail: boolean = false;
  public form: FormGroup;
  public title: string;
  public btnDisabled = false;
  public roles: any[] = [];
  public countries: any[] = [];
  public provinces: any[] = [];
  selectedEntity = {} as IdentityUserDto;
  public avatarImage;
  mode: string;
  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private roleService: RolesService,
    private userService: UsersService,
    private utilService: UtilityService,
    private fb: FormBuilder
  ) {}
  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  // Validate
  validationMessages = {
    name: [{ type: 'required', message: 'Tên không được để trống' }],
    surname: [{ type: 'required', message: 'Họ không được để trống' }],
    email: [{ type: 'required', message: 'Email không được để trống' }],
    userName: [{ type: 'required', message: 'Tên tài khoản không được để trống' }],
    password: [
      { type: 'required', message: 'Mật khẩu không được để trống' },
      {
        type: 'pattern',
        message: 'Mật khẩu ít nhất 8 ký tự, ít nhất 1 số, 1 ký tự đặc biệt, và một chữ hoa',
      },
    ],
    phoneNumber: [{ type: 'required', message: 'Số ĐT không được để trống' }],
  };
  get formControls() {
    return this.form.controls;
  }
  ngOnInit() {
    //Init form
    this.buildForm();
    
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id) == false) {
      this.loadFormDetails(this.config.data?.id);
    } else {
      this.setMode('create');
      this.toggleBlockUI(false);
    }
  }
  loadFormDetails(id: string) {
    this.userService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: IdentityUserDto) => {
          this.selectedEntity = response;
          this.buildForm();
          this.setMode('update');

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
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.userService
        .create(this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.ref.close(this.form.value);
            this.toggleBlockUI(false);
          },
          error: () => {
            this.toggleBlockUI(false);
          },
        });
    } else {
      let user = this.form.value;
      user.userName = this.selectedEntity.userName;
      user.email = this.selectedEntity.email;

      this.userService
        .update(this.config.data?.id, user)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);

            this.ref.close(this.form.value);
          },
          error: () => {
            this.toggleBlockUI(false);
          },
        });
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

  setMode(mode: string) {
    this.mode = mode;
    if (mode == 'update') {
      this.form.controls['userName'].clearValidators();
      this.form.controls['userName'].disable();
      this.form.controls['email'].clearValidators();
      this.form.controls['email'].disable();
      this.form.controls['password'].clearValidators();
      this.form.controls['password'].disable();
    } else if (mode == 'create') {
      this.form.controls['userName'].addValidators(Validators.required);
      this.form.controls['userName'].enable();
      this.form.controls['email'].addValidators(Validators.required);
      this.form.controls['email'].enable();
      this.form.controls['password'].addValidators(Validators.required);
      this.form.controls['password'].enable();
    }
  }
  buildForm() {
    this.form = this.fb.group({
      name: new FormControl(this.selectedEntity.name || null, Validators.required),
      surname: new FormControl(this.selectedEntity.surname || null, Validators.required),
      userName: new FormControl(this.selectedEntity.userName || null, Validators.required),
      email: new FormControl(this.selectedEntity.email || null, Validators.required),
      phoneNumber: new FormControl(this.selectedEntity.phoneNumber || null, Validators.required),
      password: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}$'
          ),
        ])
      ),
      isActive: [this.selectedEntity.isActive ||  false]
    });
  }
}
