import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl overflow-hidden border border-border h-[400px] bg-card">
      <div #mapContainer class="w-full h-full"></div>
    </div>
  `
})
export class MapComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map: any;

  ngOnInit() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initMap();
    };
    document.head.appendChild(script);
  }

  private initMap(): void {
    const mapProperties = {
      center: { lat: 40.712776, lng: -74.005974 }, 
      zoom: 15,
      mapTypeControl: false,
      styles: [
        {
          "featureType": "all",
          "elementType": "geometry",
          "stylers": [{ "color": "#f5f5f5" }]
        },
        {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#616161" }]
        }
      ]
    };

    this.map = new (window as any).google.maps.Map(
      this.mapContainer.nativeElement,
      mapProperties
    );

    const marker = new (window as any).google.maps.Marker({
      position: mapProperties.center,
      map: this.map,
      title: 'Our Office',
      animation: (window as any).google.maps.Animation.DROP
    });

    const infoWindow = new (window as any).google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-bold">Our Office</h3>
          <p>123 Legal Street, Suite 100</p>
          <p>New York, NY 10001</p>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
  }
} 