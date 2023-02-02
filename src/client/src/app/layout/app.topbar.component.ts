import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LOGIN_URL } from '../shared/constants/urls.const';
import { LayoutService } from './service/app.layout.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
  items!: MenuItem[];
  userMenuItems: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  isAutenticated: boolean = false;
  userName = '';

  constructor(
    public layoutService: LayoutService,
    private router: Router,
    private oAuthService: OAuthService
  ) {}
  ngOnInit(): void {
    this.isAutenticated = this.oAuthService.hasValidAccessToken();
    if (this.isAutenticated) {
      const accessToken = this.oAuthService.getAccessToken();
      // console.log('accessToken', accessToken);
      // let identityClaim = this.oAuthService.getIdentityClaims();
      // console.log('identityClaim', identityClaim); // null
      let decodedAccessToken = atob(accessToken.split('.')[1]);
      let accessTokenJson = JSON.parse(decodedAccessToken);
      this.userName = accessTokenJson.preferred_username ?? '';
    }
    this.userMenuItems = [
      {
        label: 'thông tin cá nhân',
        icon: 'pi pi-id-card',
        routerLink: ['/profile'],
      },
      {
        label: 'Đổi mật khẩu',
        icon: 'pi pi-key',
        routerLink: ['/change-password'],
      },
      {
        label: 'Đăng xuất',
        icon: 'pi pi-sign-out',
        command: event => {
          this.oAuthService.logOut();
          this.router.navigate([LOGIN_URL, this.router.url]);
        },
      },
    ];
  }
}
