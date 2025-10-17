import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments.prod';

export interface Department {
  id: number;
  name: string;
}

export interface Doctor {
  id: number;
  name: string;
  departmentId: number;
}

export interface Appointments {
  id?: number;
  userId: number;
  doctorId: number;
  preferredDate: string;
  availableTimeSlots: string;
  reasonforVisit: string;
  createdDate?: string;
  status?: string;
  checkIn?: boolean;
  
  // Display fields
  doctorName?: string;
  departmentName?: string;
  patientName?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<Department[]> {
    return this.http.post<Department[]>(`${environment.apiUrl}Department/GetAll`, null);
  }

  getDoctorsByDepartment(departmentId: number): Observable<Doctor[]> {
    return this.http.post<Doctor[]>(`${environment.apiUrl}Appointment/GetDoctorsByDepartment`, { departmentId });
  }

  getAllAppointments(): Observable<Appointments[]> {
    return this.http.post<Appointments[]>(`${environment.apiUrl}Appointment/GetAllWithDetails`, null);
  }

  createAppointment(appointment: Appointments): Observable<Appointments> {
    const payload = {
      userId: appointment.userId,
      doctorId: appointment.doctorId,
      preferredDate: appointment.preferredDate,
      availableTimeSlots: appointment.availableTimeSlots,
      reasonforVisit: appointment.reasonforVisit,
      createdDate: new Date().toISOString()
    };
    return this.http.post<Appointments>(`${environment.apiUrl}Appointment/Create`, payload);
  }

  getAppointmentsByUser(userId: number): Observable<Appointments[]> {
    return this.http.post<Appointments[]>(`${environment.apiUrl}Appointment/GetAppointmentsByUser`, { userId });
  }

  updateAppointment(id: number, appointment: Appointments): Observable<any> {
    return this.http.post(`${environment.apiUrl}Appointment/Update`, { 
      id: id,
      ...appointment 
    });
  }

  checkInAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}Appointment/CheckIn`, { appointmentId });
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}Appointment/Delete`, { appointmentId });
  }
}