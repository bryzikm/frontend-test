import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { RoutesService } from './services/routes.service';
import { of } from 'rxjs';
import { FORMATTED_RESPONSE } from './services/routes.service.spec';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let routesService: jasmine.SpyObj<RoutesService>;

  beforeEach(async () => {
    routesService = jasmine.createSpyObj('RoutesService', ['getRoutes']);
    routesService.getRoutes.and.returnValue(of(FORMATTED_RESPONSE));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: RoutesService,
          useValue: routesService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedRoute variable', () => {
    component.onRouteSelect(FORMATTED_RESPONSE[0]);
    expect(component.selectedRoute).toEqual({ ...FORMATTED_RESPONSE[0] });

    component.onRouteSelect(null);
    expect(component.selectedRoute).toEqual(null);
  });

  it('should render map component', () => {
    const mapComponent = fixture.debugElement.query(By.css('app-map'));

    expect(mapComponent).toBeDefined();
  });

  it('should render routes component', () => {
    const routesComponent = fixture.debugElement.query(By.css('app-routes'));

    expect(routesComponent).toBeDefined();
  });
});
