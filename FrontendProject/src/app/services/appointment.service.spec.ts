import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppointmentService, Department, Doctor, Appointments } from './appointment.service';
import { environment } from '../environments/environments.prod';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppointmentService]
    });

    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no pending requests
  });

  it('should fetch all departments', () => {
    const dummyDepartments: Department[] = [
      { id: 1, name: 'Cardiology' },
      { id: 2, name: 'Neurology' }
    ];

    service.getAllDepartments().subscribe(departments => {
      expect(departments.length).toBe(2);
      expect(departments).toEqual(dummyDepartments);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}Department/GetAll`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyDepartments);
  });

  it('should fetch doctors by department', () => {
    const departmentId = 1;
    const dummyDoctors: Doctor[] = [
      { id: 1, name: 'Dr. John', departmentId: 1 },
      { id: 2, name: 'Dr. Alice', departmentId: 1 }
    ];

    service.getDoctorsByDepartment(departmentId).subscribe(doctors => {
      expect(doctors.length).toBe(2);
      expect(doctors).toEqual(dummyDoctors);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}Appointment/GetDoctorsByDepartment`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ departmentId });
    req.flush(dummyDoctors);
  });

  it('should fetch all appointments', () => {
    const dummyAppointments: Appointments[] = [
      { id: 1, userId: 1, doctorId: 1, preferredDate: '2025-10-18', availableTimeSlots: '10:00-11:00', reasonforVisit: 'Checkup' },
      { id: 2, userId: 2, doctorId: 2, preferredDate: '2025-10-19', availableTimeSlots: '11:00-12:00', reasonforVisit: 'Consultation' }
    ];

    service.getAllAppointments().subscribe(appointments => {
      expect(appointments.length).toBe(2);
      expect(appointments).toEqual(dummyAppointments);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}Appointment/GetAllWithDetails`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyAppointments);
  });

  it('should create a new appointment', () => {
    const newAppointment: Appointments = {
      userId: 1,
      doctorId: 2,
      preferredDate: '2025-10-20',
      availableTimeSlots: '09:00-10:00',
      reasonforVisit: 'Follow-up'
    };

    service.createAppointment(newAppointment).subscribe(res => {
      expect(res).toEqual({ ...newAppointment, id: 1 });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}Appointment/Create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.userId).toBe(1);
    req.flush({ ...newAppointment, id: 1 });
  });

  it('should get appointments by user', () => {
    const userId = 1;
    const dummyAppointments: Appointments[] = [
      { id: 1, userId: 1, doctorId: 1, preferredDate: '2025-10-18', availableTimeSlots: '10:00-11:00', reasonforVisit: 'Checkup' }
    ];

    service.getAppointmentsByUser(userId).subscribe(appointments => {
      expect(appointments.length).toBe(1);
      expect(appointments).toEqual(dummyAppointments);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}Appointment/GetAppointmentsByUser`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userId });
    req.flush(dummyAppointments);
  });

  it('should update an appointment', () => {
    const updatedAppointment: Appointments = {
      id: 1,
      userId: 1,
      doctorId: 1,
      preferredDate: '2025-10-21',
      availableTimeSlots: '12:00-13:00',
      reasonforVisit: 'Updated Reason'
    };

    service.updateAppointment(1, updatedAppointment).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}Appointment/Update`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id).toBe(1);
    req.flush({ success: true });
  });

  it('should check in an appointment', () => {
    const appointmentId = 1;

    service.checkInAppointment(appointmentId).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}Appointment/CheckIn`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ appointmentId });
    req.flush({ success: true });
  });

  it('should cancel an appointment', () => {
    const appointmentId = 1;

    service.cancelAppointment(appointmentId).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}Appointment/Delete`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ appointmentId });
    req.flush({ success: true });
  });
});
