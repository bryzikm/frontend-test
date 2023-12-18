import { PointInterface } from './point.interface';

export interface RouteInterface {
  routeId: number;
  fromPort: string;
  toPort: string;
  legDuration: number;
  points: Array<PointInterface>;
}
