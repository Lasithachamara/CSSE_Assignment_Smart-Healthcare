import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments.prod';

export interface Doctor {
  id: number;
  name: string;
  departmentId: number;
  departmentName?: string;
  specialization?: string;
  contactNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseUrl = `${environment.apiUrl}Doctor`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Doctor[]> {
    return this.http.post<Doctor[]>(`${this.baseUrl}/GetAll`, {});
  }

  getById(id: number): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.baseUrl}/GetById`, id);
  }

  create(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.baseUrl}/Create`, doctor);
  }

  update(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.baseUrl}/Update`, doctor);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/Delete`, id);
  }
}
