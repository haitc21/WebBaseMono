import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.locatecontrol';
const iconRetinaUrl = 'assets/images//marker-icon-2x.png';
const iconUrl = 'assets/images/marker-icon.png';
const shadowUrl = 'assets/images/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map;

  constructor() {}
  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map').setView([21.027764, 105.83416], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 18,
    }).addTo(this.map);

    // nút định vị
    this.buildLocateBtn();
    this.buildEventMapClick();
  }

  buildLocateBtn() {
    return L.control
      .locate({
        position: 'topleft',
        drawCircle: true,
        follow: true,
        setView: true,
        keepCurrentZoomLevel: true,
        markerStyle: {
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8,
        },
        circleStyle: {
          weight: 1,
          clickable: false,
        },
        icon: 'fa fa-map-marker',
        metric: true,
        strings: {
          title: 'Vị trí hiện tại',
          popup: 'Bạn cách đây {distance} {unit}',
          outsideMapBoundsMsg: 'Vị trí hiện tại năm ngoài bản đồ',
        },
        locateOptions: {
          maxZoom: 22,
          watch: true,
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 1000,
        },
      })
      .addTo(this.map);
  }
  buildEventMapClick() {
    this.map.on('click', e => {
      L.popup()
        .setLatLng(e.latlng)
        .setContent(
          `<b>Vị trí: </b> </br> <p>Kinh độ: ${e.latlng.lat}, Vĩ độ: ${e.latlng.lng} </p>`
        )
        .openOn(this.map);
    });
  }
}
