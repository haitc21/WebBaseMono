import { AuthService } from '@abp/ng.core';
import { Component, ElementRef, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ToastType } from 'src/app/shared/enum';
import { Util } from 'src/app/shared/util';

const { maxLength, required } = Validators;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  inProgress: boolean;

  protected fb: FormBuilder;
  protected authService: AuthService;
  protected toastrService: NbToastrService;

  constructor(protected injector: Injector) {
    this.fb = injector.get(FormBuilder);
    this.authService = injector.get(AuthService);
    this.toastrService = injector.get(NbToastrService);
  }

  ngOnInit() {
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
    const redirectUrl = '/';
    const loginParams = { username, password, rememberMe, redirectUrl };
    this.authService.login(loginParams).subscribe(
      data => {
        // console.log(data);
      },
      err => {
        debugger;
        console.log('error_description',err.error?.error_description);
        this.toastrService.show(
          err.error?.error_description,
          'Có lỗi xảy ra',
          Util.configDefaultToast(ToastType.danger)
        );
      }
    );
  }
}
