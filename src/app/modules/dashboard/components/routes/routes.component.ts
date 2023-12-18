import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { RoutesService } from '../../services/routes.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouteInterface } from '../../models/route.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DurationPipe } from '../../pipes/duration.pipe';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { NgIf } from '@angular/common';
import { LineChartComponent } from '../line-chart/line-chart.component';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    DurationPipe,
    MatSortModule,
    NgIf,
    LineChartComponent,
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss',
})
export class RoutesComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource = new MatTableDataSource<RouteInterface>([]);
  selectedRoute: RouteInterface | null = null;
  readonly searchControl = new FormControl('');
  readonly displayedColumns = ['routeId', 'fromPort', 'toPort', 'legDuration'];

  private data: Array<RouteInterface> = [];
  private readonly $destroyed = new Subject<void>();

  @Output() routeSelected = new EventEmitter<RouteInterface | null>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private routesService: RoutesService) {}

  ngOnInit() {
    this.getRoutes();
    this.watchSearchValue();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.$destroyed.complete();
    this.$destroyed.next();
  }

  onRowClick(row: RouteInterface): void {
    const emittedValue =
      row.routeId === this.selectedRoute?.routeId ? null : row;

    this.routeSelected.emit(emittedValue);
    this.selectedRoute = emittedValue;
  }

  private getRoutes(): void {
    this.routesService.getRoutes().subscribe((data) => {
      this.data = data;
      this.dataSource.data = data;
    });
  }

  private watchSearchValue(): void {
    this.searchControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.$destroyed),
        debounceTime(300),
      )
      .subscribe((searchText) => {
        this.filterRoutesBySearchText(searchText ?? '');
      });
  }

  private filterRoutesBySearchText(searchText: string) {
    const searchTextLowerCase = searchText?.toLowerCase() || '';

    this.dataSource.data = this.data?.filter(
      (route: RouteInterface) =>
        `${route.routeId}`.includes(searchTextLowerCase) ||
        route.fromPort?.toLowerCase().includes(searchTextLowerCase) ||
        route.toPort?.toLowerCase().includes(searchTextLowerCase),
    );
  }
}
