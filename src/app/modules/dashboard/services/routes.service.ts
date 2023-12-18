import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RouteInterface } from '../models/route.interface';
import { PointInterface } from '../models/point.interface';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  constructor(private httpClient: HttpClient) {}

  public getRoutes(): Observable<Array<RouteInterface>> {
    return this.httpClient
      .get(
        'https://raw.githubusercontent.com/Marcura/frontend-developer-test/master/web_challenge.csv',
        { responseType: 'text' },
      )
      .pipe(
        map((csv: string) => {
          if (csv?.length) {
            return this.mapCsvToRoutesArray(csv);
          }

          return [];
        }),
      );
  }

  private mapCsvToRoutesArray(csv: string): Array<RouteInterface> {
    const rows = this.mapCsvToStringArray(csv.trim());

    return this.mapRowsToRoutesArray(rows);
  }

  private mapCsvToStringArray(csv: string): Array<Array<string>> {
    const splittedArray = csv.split('\n');
    const stringifiedRows = splittedArray?.slice(1); // removing header row

    return stringifiedRows?.map((row: string) => {
      const columns = row.split('",');

      return columns.map((columnItem: string) => columnItem.replace('"', ''));
    });
  }

  private mapRowsToRoutesArray(
    rows: Array<Array<string>>,
  ): Array<RouteInterface> {
    return rows.map((row: Array<string>): RouteInterface => {
      const points = this.mapStringToPointsArray(row[4]);

      return {
        routeId: parseInt(row[0], 10),
        fromPort: row[1],
        toPort: row[2],
        legDuration: parseInt(row[3], 10),
        points,
      };
    });
  }

  private mapStringToPointsArray(pointsString: string): Array<PointInterface> {
    const pointsArray: Array<Array<number>> = JSON.parse(
      pointsString?.replace('"', ''),
    );

    return pointsArray.map(
      (pointRow: Array<number>): PointInterface => ({
        longitude: pointRow[0],
        latitude: pointRow[1],
        timestamp: pointRow[2] ?? 0,
        vesselSpeed: pointRow[3] ?? 0,
      }),
    );
  }
}
