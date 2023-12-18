import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartComponent } from './line-chart.component';
import { DatePipe } from '@angular/common';
import { FORMATTED_RESPONSE } from '../../services/routes.service.spec';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define chart object and destroy it', () => {
    component.id = 1;
    component.selectedRoute = FORMATTED_RESPONSE[0];

    expect(component.chart).toBeDefined();

    component.selectedRoute = null;

    expect(component.chart).toBeUndefined();
  });
});
