import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientReports } from './patient-reports';

describe('PatientReports', () => {
  let component: PatientReports;
  let fixture: ComponentFixture<PatientReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
