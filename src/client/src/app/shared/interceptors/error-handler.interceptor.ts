import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
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
        if (ex.status == 500) {
          let InternalServerErrorMessage = this.localizationService.instant(
            'AbpFeatureManagement::InternalServerErrorMessage'
          );
          this.notificationService.showError(InternalServerErrorMessage);
        }
        throw ex;
      })
    );
  }
}
