import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';
import { Util } from '../utilities';
import { ToastType } from '../enums';
import { LocalizationService } from '@abp/ng.core';
import { Consts } from '../consts';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  constructor(
    private toastrService: NbToastrService,
    private localizationService: LocalizationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(ex => {
        if (ex.status == 500) {
          let InternalServerErrorMessage = this.localizationService.instant(
            'AbpAccount::InternalServerErrorMessage'
          );
          this.toastrService.show(
            InternalServerErrorMessage,
            Consts.TOAST_DANGER_TITILE,
            Util.configDefaultToast(ToastType.danger)
          );
        }
        throw ex;
      })
    );
  }
}
