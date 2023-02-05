import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet-search';

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
  marker: any;

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
    let locateControl = L.control
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
          maximumAge: 10000,
          timeout: 10000,
        },
      })
      .addTo(this.map);

    // Tạo marker màu xanh dương
    let blueMarker = L.icon({
      iconUrl: 'path/to/blue-marker.png',
      iconSize: [38, 95],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowUrl: 'path/to/marker-shadow.png',
      shadowSize: [68, 95],
      shadowAnchor: [22, 94],
    });

    // Thêm nút tìm kiếm vị trí vào bản đồ
    let searchControl = new L.Control.Search({
      url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
      jsonpParam: 'json_callback',
      propertyName: 'display_name',
      propertyLoc: ['lat', 'lon'],
      marker: false,
      autoCollapse: true,
      autoType: false,
      minLength: 2,
    });
    this.map.addControl(searchControl);

    // Khi người dùng tìm kiếm vị trí, đánh dấu vị trí bằng marker màu xanh dương
    // searchControl
    //   .on('search:locationfound', e => {
    //     this.map.removeLayer(this.marker); // Remove any previous marker
    //     this.marker = L.marker(e.latlng, { icon: blueMarker }).addTo(this.map);
    //   })
    //   .on('search:collapsed', e => {
    //     this.marker.removeFrom(this.map);
    //   });
  }
}
