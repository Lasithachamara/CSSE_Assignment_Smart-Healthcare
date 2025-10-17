import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAppointment } from './add-appointment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppointmentService } from '../../../services/appointment.service'; 

describe('AddAppointment', () => {
  let component: AddAppointment;
  let fixture: ComponentFixture<AddAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddAppointment,       
        HttpClientTestingModule 
      ],
      providers: [
        AppointmentService    
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
