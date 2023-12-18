import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { RouteInterface } from '../../models/route.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit {
  chart: Chart | undefined;

  @Input({ required: true }) id: number;
  @Input() set selectedRoute(route: RouteInterface | null) {
    this.destroyChart();

    if (this.id === route?.routeId) {
      this.createChart(route);
    }
  }

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    Chart.register(...registerables);
  }

  private createChart(route: RouteInterface | null) {
    if (route) {
      const timestampLabels = route.points.map((point) =>
        this.datePipe.transform(point.timestamp, 'dd.MM.yyyy HH:mm:ss'),
      );
      const speedData = route.points.map((point) => point.vesselSpeed);

      this.chart = new Chart(`speed-chart-${this.id}`, {
        type: 'line',
        data: {
          labels: timestampLabels,
          datasets: [
            {
              label: 'Vessel speed',
              data: speedData,
            },
          ],
        },
      });
    }
  }

  private destroyChart(): void {
    if (this.chart) {
      // destroying generated chart to be able to render
      // it one more time and to be sure if it is not kept in memory
      this.chart.destroy();
      this.chart = undefined;
    }
  }
}
