import { AuthService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  blockedPanel = false;

  // fileter
  landComplaint = false;
  enviromentalComplaint = false;
  waterResourcedComplaint = false;
  mineralResourcedComplaint = false; 

  landAccusation = false;
  emviromentalAccusation = false;
  waterResourcedAccusation = false;
  mineralResourcedAccusation = false;

  get hasLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  constructor(private oAuthService: OAuthService, private authService: AuthService) {}

  ngOnInit(): void {}
  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 300);
    }
  }
}
