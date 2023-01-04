import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  template: `
    <ngx-one-column-layout [hasSidebar]="false">
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
