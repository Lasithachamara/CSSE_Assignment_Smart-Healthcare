import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAppointmentConfirm } from './patient-appointment-confirm';

describe('PatientAppointmentConfirm', () => {
  let component: PatientAppointmentConfirm;
  let fixture: ComponentFixture<PatientAppointmentConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientAppointmentConfirm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientAppointmentConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
