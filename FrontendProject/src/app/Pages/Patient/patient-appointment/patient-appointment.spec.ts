import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientAppointment } from './patient-appointment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppointmentService } from '../../../services/appointment.service'; 

describe('PatientAppointment', () => {
  let component: PatientAppointment;
  let fixture: ComponentFixture<PatientAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PatientAppointment,
        HttpClientTestingModule
      ],
      providers: [
        AppointmentService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
