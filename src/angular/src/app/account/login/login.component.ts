import { AuthService } from '@abp/ng.core';
import { Component, ElementRef, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, pipe, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

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

  constructor(protected injector: Injector) {
    this.fb = injector.get(FormBuilder);
    this.authService = injector.get(AuthService);
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
        console.log(err.error?.error_description);
      }
    );
  }
}
