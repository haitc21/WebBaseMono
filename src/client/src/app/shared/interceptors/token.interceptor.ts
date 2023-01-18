import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';

const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end

import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { LOGIN_URL } from '../constants/urls.const';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private oAuthService: OAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes(LOGIN_URL) &&
          error.status === 401
        ) {
          return this.handle401Error(req, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.oAuthService.getRefreshToken();
      if (token) {
        try {
          this.oAuthService.refreshToken();
          this.isRefreshing = false;
          let access_token = this.oAuthService.getAccessToken();
          this.refreshTokenSubject.next(access_token);

          return next.handle(this.addTokenHeader(request, access_token));
        } catch (err) {
          this.isRefreshing = false;
          this.oAuthService.logOut();
          return throwError(err);
        }
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addTokenHeader(request, token)))
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`) });
  }
}
