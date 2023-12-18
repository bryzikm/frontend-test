import { Component } from '@angular/core';
import { MapComponent } from './components/map/map.component';
import { RoutesComponent } from './components/routes/routes.component';
import { RouteInterface } from './models/route.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MapComponent, RoutesComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  selectedRoute: RouteInterface | null = null;
  constructor() {}

  onRouteSelect(route: RouteInterface | null) {
    this.selectedRoute = route;
  }
}
