import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientAppointmentConfirm } from './patient-appointment-confirm';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppointmentService } from '../../../services/appointment.service'; 

describe('PatientAppointmentConfirm', () => {
  let component: PatientAppointmentConfirm;
  let fixture: ComponentFixture<PatientAppointmentConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PatientAppointmentConfirm,
        HttpClientTestingModule
      ],
      providers: [
        AppointmentService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientAppointmentConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
