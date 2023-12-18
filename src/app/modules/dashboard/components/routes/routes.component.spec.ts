import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutesComponent } from './routes.component';
import { RoutesService } from '../../services/routes.service';
import { of } from 'rxjs';
import { FORMATTED_RESPONSE } from '../../services/routes.service.spec';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DatePipe } from '@angular/common';

describe('RoutesComponent', () => {
  let component: RoutesComponent;
  let fixture: ComponentFixture<RoutesComponent>;
  let routesService: jasmine.SpyObj<RoutesService>;
  let loader;
  let matTableHarness: MatTableHarness;
  let matInputHarness: MatInputHarness;

  beforeEach(async () => {
    routesService = jasmine.createSpyObj('RoutesService', ['getRoutes']);
    routesService.getRoutes.and.returnValue(of(FORMATTED_RESPONSE));

    await TestBed.configureTestingModule({
      imports: [RoutesComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: RoutesService,
          useValue: routesService,
        },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    matTableHarness = await loader.getHarness(MatTableHarness);
    matInputHarness = await loader.getHarness(MatInputHarness);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define harnesses', () => {
    expect(matTableHarness).toBeDefined();
    expect(matInputHarness).toBeDefined();
  });

  it('should render data rows from response', async () => {
    const dataRows = await matTableHarness.getRows({
      selector: '.route-row',
    });

    expect(dataRows.length).toEqual(2);
  });

  it('should filter rows', async () => {
    await matInputHarness.setValue('start1');
    const filteredRows = await matTableHarness.getRows({
      selector: '.route-row',
    });

    expect(filteredRows.length).toEqual(1);
  });
});
