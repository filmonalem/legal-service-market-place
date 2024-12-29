import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map: google.maps.Map | undefined;

  // Initialize the map
  initMap(containerId: string, center: google.maps.LatLngLiteral, zoom: number): void {
    const mapElement = document.getElementById(containerId);
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, {
        center,
        zoom,
      });
    }
  }

  // Add a marker to the map
  addMarker(position: google.maps.LatLngLiteral, title: string): void {
    if (this.map) {
      new google.maps.Marker({
        position,
        map: this.map,
        title,
      });
    }
  }

  // Get the map instance
  getMap(): google.maps.Map | undefined {
    return this.map;
  }
}
