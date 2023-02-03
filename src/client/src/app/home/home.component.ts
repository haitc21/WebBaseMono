import { AuthService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import * as L from 'leaflet';
import 'leaflet.locatecontrol';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private map;
  get hasLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  constructor(private oAuthService: OAuthService, private authService: AuthService) {}

  ngOnInit(): void {
    this.initMap();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        debugger
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.map.panTo(new L.LatLng(lat, lng));
        L.marker([lat, lng]).addTo(this.map);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  initMap() {
     this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    const locateControl = L.control.locate({
      position: 'topleft',
      strings: {
        title: 'Show me where I am, yo!'
      }
    }).addTo(this.map);

    L.control.zoom({
      position: 'topright'
    }).addTo(this.map);
  }
}
