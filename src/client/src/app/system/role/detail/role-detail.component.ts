import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { RoleDto, RolesService } from '@proxy/roles';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  templateUrl: './role-detail.component.html',
})
export class RoleDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  // Default
  public blockedPanelDetail: boolean = false;
  public form: FormGroup;
  public title: string;
  public btnDisabled = false;
  public closeBtnName: string;
  selectedEntity = {} as RoleDto;

  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private roleService: RolesService,
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
  ngOnInit() {
    this.buildForm();
    if (this.utilService.isEmpty(this.config.data?.id) == false) {
      this.loadDetail(this.config.data.id);
    }
  }

  // Validate
  validationMessages = {
    name: [
      { type: 'required', message: 'Tên vai trò không được để trống!' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 3 kí tự' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
    ],
    description: [
      { type: 'required', message: 'Bạn phải mô tả' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 3 kí tự' },
    ],
  };

  get formControls() {
    return this.form.controls;
  }

  loadDetail(id: any) {
    this.toggleBlockUI(true);
    this.roleService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: RoleDto) => {
          this.selectedEntity = response;
          this.form.patchValue(this.selectedEntity);
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  saveChange() {
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.roleService
        .create(this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          () => {
            this.ref.close(this.form.value);
            this.toggleBlockUI(false);
          },
          err => {
            this.toggleBlockUI(false);
          }
        );
    } else {
      this.roleService
        .update(this.config.data.id, this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          () => {
            this.toggleBlockUI(false);
            this.ref.close(this.form.value);
          },
          err => {
            this.toggleBlockUI(false);
          }
        );
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      isPublic: [true],
      isDefault: [false],
    });
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
