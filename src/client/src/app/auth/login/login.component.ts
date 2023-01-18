import { AuthService, LocalizationService } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      :host ::ng-deep .p-password input {
        width: 100%;
        padding: 1rem;
      }

      :host ::ng-deep .pi-eye {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }

      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  valCheck: string[] = ['remember'];
  redirectUrl: string = '';
  password!: string;

  form: FormGroup;
  public blockedPanel: boolean = false;
  validationMessages = {
    username: [
      { type: 'required', message: 'Tên tài khoàn không được để trống!' },
      {
        type: 'maxlength',
        message: 'Tên tài khoản không quá 255 ký tự',
      },
    ],
    password: [
      { type: 'required', message: 'Mật khẩukhông được để trống!' },
      {
        type: 'maxlength',
        message: 'Mật khẩu không quá 255 ký tự',
      },
    ],
  };
  get formControls() {
    return this.form.controls;
  }
  constructor(
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    protected authService: AuthService,
    private oAuthService: OAuthService,
    protected route: ActivatedRoute,
    protected localizationService: LocalizationService
  ) {}
  ngOnInit() {
    this.redirectUrl = this.route.snapshot.paramMap.get('redirectUrl') ?? '';
    this.buildForm();
  }
  buildForm() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.maxLength(128)]],
      rememberMe: [false],
    });
  }
  onSubmit() {
    debugger;
    if (this.form.invalid) return;
    this.toggleBlockUI(true);

    const { username, password, rememberMe } = this.form.value;
    const redirectUrl = this.redirectUrl;
    const loginParams = { username, password, rememberMe };
    this.authService.login(loginParams).subscribe(
      () => {
        this.toggleBlockUI(false);
        this.router.navigate(['']);
      },
      err => {
        let errorMsg =
          err.error?.error_description ||
          err.error?.error?.message ||
          'AbpAccount::DefaultErrorMessage';
        if (errorMsg.includes('Invalid username or password!')) {
          errorMsg = this.localizationService.instant('AbpAccount::InvalidUserNameOrPassword');
        } else if (
          errorMsg.includes(
            'The user account has been locked out due to invalid login attempts. Please wait a while and try again.'
          )
        ) {
          errorMsg = this.localizationService.instant('AbpAccount::UserLockedOutMessage');
        }
        this.notificationService.showError(errorMsg);
        this.toggleBlockUI(false);
      }
    );
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 500);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
