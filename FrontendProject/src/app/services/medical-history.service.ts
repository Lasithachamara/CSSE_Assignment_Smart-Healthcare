import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments.prod';

export interface MedicalHistory {
  id: number;
  userId: number;
  title: string;
  description: string;
  prescription: string;
  createdBy: string;
  createdDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private apiUrl = environment.apiUrl + 'MedicalHistory';

  constructor(private http: HttpClient) {}

  getByUserId(userId: number): Observable<MedicalHistory[]> {
    return this.http.post<MedicalHistory[]>(`${this.apiUrl}/GetByUserId`, userId);
  }

  getAll(): Observable<MedicalHistory[]> {
    return this.http.post<MedicalHistory[]>(`${this.apiUrl}/GetAll`, {});
  }

  getById(id: number): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(`${this.apiUrl}/GetById`, { id });
  }

  create(history: MedicalHistory): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(`${this.apiUrl}/Create`, history);
  }

  update(history: MedicalHistory): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(`${this.apiUrl}/Update`, history);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/Delete`, { id });
  }
}
