import { AuthService } from '@abp/ng.core';
import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {
  get hasLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  constructor(private oAuthService: OAuthService, private authService: AuthService) {}

  login() {
    this.authService.navigateToLogin();
    // this.authService.login({
    //   username: 'admin',
    //   password: 'Admin@123'
    // });
  }
  logout() {
    this.oAuthService.logOut();
  }
}
