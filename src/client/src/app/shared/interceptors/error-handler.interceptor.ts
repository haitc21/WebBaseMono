import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalizationService } from '@abp/ng.core';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private localizationService: LocalizationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(ex => {
        let InternalServerErrorMessage = '';
        switch (ex.status) {
          case 401:
            InternalServerErrorMessage = this.localizationService.instant(
              'AbpFeatureManagement::DefaultErrorMessage401Detail'
            );
            this.notificationService.showError(InternalServerErrorMessage);
            break;
          case 403:
            if (ex.error?.error?.message) {
              this.notificationService.showError(ex.error.error.message);
            } else {
              InternalServerErrorMessage = this.localizationService.instant(
                'AbpFeatureManagement::DefaultErrorMessage403Detail'
              );
              this.notificationService.showError(InternalServerErrorMessage);
            }
            break;
          case 404:
            InternalServerErrorMessage = this.localizationService.instant(
              'AbpFeatureManagement::DefaultErrorMessage404Detail'
            );
            this.notificationService.showError(InternalServerErrorMessage);
            break;
          case 500:
            InternalServerErrorMessage = this.localizationService.instant(
              'AbpFeatureManagement::InternalServerErrorMessage'
            );
            this.notificationService.showError(InternalServerErrorMessage);
            break;
          default:
            InternalServerErrorMessage = this.localizationService.instant(
              'AbpFeatureManagement::InternalServerErrorMessage'
            );
            this.notificationService.showError(InternalServerErrorMessage);
            break;
        }

        return throwError(ex);
      })
    );
  }
}
