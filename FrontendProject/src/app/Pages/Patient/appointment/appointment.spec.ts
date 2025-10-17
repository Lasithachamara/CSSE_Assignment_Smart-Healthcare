import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Appointment } from './appointment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppointmentService } from '../../../services/appointment.service'; 

describe('Appointment', () => {
  let component: Appointment;
  let fixture: ComponentFixture<Appointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Appointment,          
        HttpClientTestingModule 
      ],
      providers: [
        AppointmentService     
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Appointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
