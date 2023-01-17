import { AuthService, LocalizationService } from '@abp/ng.core';
import { Component, ElementRef, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { Consts } from 'src/app/shared/consts';
import { ToastType } from 'src/app/shared/enums';
import { Util } from 'src/app/shared/utilities';

const { maxLength, required } = Validators;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  inProgress: boolean;
  redirectUrl: string = '/';

  protected fb: FormBuilder;
  protected authService: AuthService;
  protected toastrService: NbToastrService;
  protected localizationService: LocalizationService;
  protected route: ActivatedRoute;

  validation_messages = {
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
  constructor(protected injector: Injector) {
    this.fb = injector.get(FormBuilder);
    this.authService = injector.get(AuthService);
    this.toastrService = injector.get(NbToastrService);
    this.localizationService = injector.get(LocalizationService);
    this.route = injector.get(ActivatedRoute);
  }

  ngOnInit() {
    this.redirectUrl = this.route.snapshot.paramMap.get('redirectUrl') ?? '/';
    this.buildForm();
  }

  protected buildForm() {
    this.form = this.fb.group({
      username: ['', [required, maxLength(255)]],
      password: ['', [required, maxLength(128)]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.inProgress = true;

    const { username, password, rememberMe } = this.form.value;
    const redirectUrl = this.redirectUrl;
    const loginParams = { username, password, rememberMe, redirectUrl };
    this.authService.login(loginParams).subscribe(
      data => {
        // console.log(data);
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
        console.log('error_description', errorMsg);
        this.toastrService.show(
          errorMsg,
          Consts.TOAST_WARNING_TITILE,
          Util.configDefaultToast(ToastType.warning)
        );
      }
    );
  }
}
