import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatientReports } from './view-patient-reports';

describe('ViewPatientReports', () => {
  let component: ViewPatientReports;
  let fixture: ComponentFixture<ViewPatientReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPatientReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPatientReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
