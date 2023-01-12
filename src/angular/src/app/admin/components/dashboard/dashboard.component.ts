import { AuthService } from '@abp/ng.core';
import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
@Component({
  selector: 'app-admin-daashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
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
}
