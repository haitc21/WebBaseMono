import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { OAuthService } from 'angular-oauth2-oidc';
import { PermissionService } from '@abp/ng.core';
import { LayoutService } from '../service/app.layout.service';
import { LOGIN_URL } from 'src/app/shared/constants/urls.const';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: ['./app.topbar.component.scss'],
})
export class AppTopBarComponent implements OnInit {
  items!: MenuItem[];
  userMenuItems: MenuItem[];
  systemMenuItems: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  isAutenticated: boolean = false;
  userName = '';
  userId = '';
  

  constructor(
    public layoutService: LayoutService,
    private router: Router,
    private oAuthService: OAuthService,
    private permissionService: PermissionService
  ) {}
  ngOnInit(): void {
    this.isAutenticated = this.oAuthService.hasValidAccessToken();
    if (this.isAutenticated) {
      const accessToken = this.oAuthService.getAccessToken();
      let decodedAccessToken = atob(accessToken.split('.')[1]);
      let accessTokenJson = JSON.parse(decodedAccessToken);
      this.userName = accessTokenJson.preferred_username ?? '';
      debugger
      this.userId = accessTokenJson.sub ?? '';
    }
    this.initMenu();
    this.initMenuUser();
    this.initMenuSystem();
  }
  initMenuUser() {
    this.userMenuItems = [
      {
        label: 'Thông tin cá nhân',
        // icon: 'pi pi-id-card',
        routerLink: ['/profile'],
      },
      {
        label: 'Đổi mật khẩu',
        // icon: 'pi pi-key',
        routerLink: ['/change-password'],
      },
      {
        label: 'Đăng xuất',
        // icon: 'pi pi-sign-out',
        command: event => {
          this.oAuthService.logOut();
          this.router.navigate([LOGIN_URL, this.router.url]);
        },
      },
    ];
  }

  initMenu() {
    this.items = [
      {
        icon: 'pi pi-fw pi-home',
        routerLink: ['/'],
      },
      {
        label: 'Bản đồ',
        icon: 'pi pi-fw pi-map',
        routerLink: ['/'],
      },
      {
        label: 'Khiếu nại',
        icon: 'pi pi-fw pi-envelope',
        routerLink: ['/'],
        items: [
          {
            label: 'Đất đai',
            routerLink: ['/'],
          },
          {
            label: 'Môi trường',
            routerLink: ['/'],
          },

          {
            label: 'Khoáng sản',
            routerLink: ['/'],
          },
          {
            label: 'Tài nguyên nước',
            routerLink: ['/'],
          },
        ],
      },
      {
        label: 'Tố cáo',
        icon: 'fa fa-balance-scale',
        routerLink: ['/'],
        items: [
          {
            label: 'Đất đai',
            routerLink: ['/'],
          },

          {
            label: 'Môi trường',
            routerLink: ['/'],
          },

          {
            label: 'Khoáng sản',
            routerLink: ['/'],
          },
          {
            label: 'Tài nguyên nước',
            routerLink: ['/'],
          },
        ],
      },
    ];
  }

  initMenuSystem() {
    this.systemMenuItems = [
      {
        label: 'Cấu hình hệ thống',
        routerLink: ['/'],
      },
      {
        label: 'Quản lý ngời dùng',
        // icon: 'pi pi-fw pi-users',
        routerLink: ['/system/user'],
        visible: this.permissionService.getGrantedPolicy('AbpIdentity.Users'),
      },
      {
        label: 'Quản lý vai trò',
        // icon: 'pi pi-fw pi-user-edit',
        routerLink: ['/system/role'],
        visible: this.permissionService.getGrantedPolicy('AbpIdentity.Roles'),
      },
      {
        label: 'Danh mục',
        routerLink: ['/'],
      },
    ];
  }

  login() {
    this.router.navigate([LOGIN_URL, this.router.url]);
  }
}
