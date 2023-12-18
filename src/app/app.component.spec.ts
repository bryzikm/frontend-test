import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let loader;
  let toolbarHarness: MatToolbarHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    toolbarHarness = await loader.getHarness(MatToolbarHarness);
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should toolbar render proper title', async () => {
    expect(await toolbarHarness.getRowsAsText()).toEqual([
      'Marcura - Mateusz Bryzik developer test',
    ]);
  });
});
