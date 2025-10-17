import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PatientCheckIn } from './patient-check-in';
import { AppointmentService } from '../../../services/appointment.service';

describe('PatientCheckIn', () => {
  let component: PatientCheckIn;
  let fixture: ComponentFixture<PatientCheckIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCheckIn, HttpClientTestingModule], 
      providers: [AppointmentService] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCheckIn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
