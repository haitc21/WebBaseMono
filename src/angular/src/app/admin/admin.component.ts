import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-admin',
  styleUrls: ['admin.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class AdminComponent implements OnInit {
  menu: NbMenuItem[] = [];
  ngOnInit(): void {
    this.menu = [
      {
        title: 'Dashboard',
        icon: 'home-outline',
        link: '/admin/dashboard',
        home: true,
      },
      {
        title: 'Quản trị người dùng',
        icon: 'lock-outline',
        children: [
          {
            title: 'Vai trò',
            icon: 'grid-outline',
            link: '/admin/roles',
          },
          {
            title: 'Người dùng',
            icon: 'people-outline',
            link: '/admin/users',
          }
        ],
      },
    ];
  }
}
