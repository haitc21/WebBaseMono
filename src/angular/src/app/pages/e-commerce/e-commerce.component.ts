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

  constructor(private oAuthService: OAuthService, private authService: AuthService) {
    // console.log(this.oAuthService.clientId);
    // console.log(this.oAuthService.scope);
    // const accessToken = this.oAuthService.getAccessToken();
    // console.log('accessToken',accessToken);
    // let refreshToken = this.oAuthService.getRefreshToken();
    // console.log('refreshToken',refreshToken);
    // let identityClaim = this.oAuthService.getIdentityClaims();
    // console.log('getGrantedScopes',identityClaim);
  }

  login() {
    // this.authService.navigateToLogin();
    this.authService.login({
      username: 'admin',
      password: 'Admin@123'
    });
  }
  logout() {
    this.oAuthService.logOut();
  }
}
