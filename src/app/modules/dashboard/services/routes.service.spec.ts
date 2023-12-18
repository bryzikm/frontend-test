import { TestBed } from '@angular/core/testing';
import { RoutesService } from './routes.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { csvRoutesMock } from '../../../../testing/mocks/csv-routes.mock';
import { RouteInterface } from '../models/route.interface';

export const FORMATTED_RESPONSE: Array<RouteInterface> = [
  {
    routeId: 1,
    fromPort: 'START1',
    toPort: 'END1',
    legDuration: 60000,
    points: [
      {
        longitude: 8,
        latitude: 16,
        timestamp: 1498312124657,
        vesselSpeed: 12,
      },
      {
        longitude: 9,
        latitude: 21,
        timestamp: 1498370536123,
        vesselSpeed: 5.1,
      },
    ],
  },
  {
    routeId: 2,
    fromPort: 'START2',
    toPort: 'END2',
    legDuration: 90000,
    points: [
      {
        longitude: 18,
        latitude: 26,
        timestamp: 1498360414478,
        vesselSpeed: 2.7,
      },
      {
        longitude: 11,
        latitude: 31,
        timestamp: 1498367776378,
        vesselSpeed: 1.1,
      },
    ],
  },
];

describe('RoutesService', () => {
  let service: RoutesService;
  let httpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpClient', ['get']);
    httpClient.get.and.returnValue(of(csvRoutesMock));

    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClient,
        },
      ],
    });
    service = TestBed.inject(RoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return formatted data', () => {
    service.getRoutes().subscribe((routes) => {
      expect(routes).toEqual(FORMATTED_RESPONSE);
    });
  });
});
