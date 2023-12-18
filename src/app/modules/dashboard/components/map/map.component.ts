import { Component, Input, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { RouteInterface } from '../../models/route.interface';
import { PointInterface } from '../../models/point.interface';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  private polyLines: google.maps.Polyline[] = [];
  private markers: google.maps.Marker[] = [];
  private map: google.maps.Map | undefined;

  @Input() set selectedRoute(route: RouteInterface | null) {
    this.removePolyLines();
    this.removeMarkers();

    if (route) {
      this.addPolyLines(route);
      this.addMarkersAndInfoWindows(route);
    } else {
      this.setMapCenterAndZoom(0, 0, 2);
    }
  }

  ngOnInit() {
    this.initMap();
  }

  private addPolyLines(route: RouteInterface) {
    const averageSpeed = this.calculateAverageSpeed(route.points); // calculated to color polyline base on average speed

    for (let i = 0; i < route.points.length - 2; i++) {
      const path = [
        { lat: route.points[i].latitude, lng: route.points[i].longitude },
        {
          lat: route.points[i + 1].latitude,
          lng: route.points[i + 1].longitude,
        },
      ];
      const polyLine = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor:
          route.points[i].vesselSpeed < averageSpeed ? '#FF0000' : '#00FF00',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      polyLine.setMap(this.map as google.maps.Map);
      this.polyLines.push(polyLine);
    }

    this.setMapCenterAndZoom(
      route.points[0].latitude,
      route.points[0].longitude,
      6,
    );
  }

  private addMarkersAndInfoWindows(route: RouteInterface): void {
    const lastPointsArrayIndex = route.points?.length - 1;

    this.addMarkerAndInfoWindow(
      `From port: ${route.fromPort}`,
      route.points[0].latitude,
      route.points[0].longitude,
    );
    this.addMarkerAndInfoWindow(
      `To port: ${route.toPort}`,
      route.points[lastPointsArrayIndex].latitude,
      route.points[lastPointsArrayIndex].longitude,
    );
  }

  private addMarkerAndInfoWindow(text: string, lat: number, lng: number) {
    const infoWindow = new google.maps.InfoWindow({
      content: text,
      ariaLabel: text,
    });
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: text,
    });

    marker.addListener('click', () =>
      infoWindow.open({ anchor: marker, map: this.map }),
    );
    this.markers.push(marker);
  }

  private calculateAverageSpeed(points: PointInterface[]): number {
    return (
      points.reduce(
        (previousValue, currentValue) =>
          previousValue + currentValue.vesselSpeed,
        0,
      ) / points.length
    );
  }

  private initMap(): void {
    const loader = new Loader({
      apiKey: 'AIzaSyDoBS1_02LAIz1EgoBOUenJ2v_664b0Amg',
      version: 'weekly',
    });

    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary(
        'maps',
      )) as google.maps.MapsLibrary;
      this.map = new Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });
    });
  }

  private setMapCenterAndZoom(lat: number, lng: number, zoom: number): void {
    this.map?.setCenter({
      lat,
      lng,
    });
    this.map?.setZoom(zoom);
  }

  private removePolyLines(): void {
    this.polyLines.forEach((polyLine) => polyLine.setMap(null));
    this.polyLines = [];
  }

  private removeMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }
}
