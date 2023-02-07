import { PermissionService } from '@abp/ng.core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  // model: any[] = [];
  items: MenuItem[];

  constructor(public layoutService: LayoutService, private permissionService: PermissionService) {}

  ngOnInit() {
    // this.model = [
    //   {
    //     label: 'Trang chủ',
    //     items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }],
    //   },
    //   {
    //     label: 'Hệ thống',
    //     items: [
    //       {
    //         label: 'Danh sách quyền',
    //         icon: 'pi pi-fw pi-circle',
    //         routerLink: ['/system/role'],
    //         permission: 'AbpIdentity.Roles',
    //       },
    //       {
    //         label: 'Danh sách người dùng',
    //         icon: 'pi pi-fw pi-circle',
    //         routerLink: ['/system/user'],
    //         permission: 'AbpIdentity.Users',
    //       },
    //     ],
    //   },
    // ];
    this.items = [
      {
        label: 'Trang chủ',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/'],
        separator: true,
      },
      {
        label: 'Hệ thống',
        items: [
          {
            label: 'Quản lý danh tính',
            items: [
              {
                label: 'Vai trò',
                icon: 'pi pi-fw pi-user-edit',
                routerLink: ['/system/role'],
                visible: this.permissionService.getGrantedPolicy('AbpIdentity.Roles'),
              },
              {
                label: 'Ngời dùng',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/system/user'],
                visible: this.permissionService.getGrantedPolicy('AbpIdentity.Users'),
              },
            ],
          },
        ],
      },
    ];
  }
}
