// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../environments/environments.prod';

// export interface MedicalReport {
//   reportId: number;
//   patientId: number;
//   reportName: string;
//   fileType: string;
//   uploadedOn: string;
//   fileData?: any; // byte[] from backend
// }

// @Injectable({
//   providedIn: 'root'   // ✅ makes the service globally available
// })
// export class MedicalReportService {

//   private apiUrl = `${environment.apiUrl}MedicalReport`;

//   constructor(private http: HttpClient) {}

// uploadReport(patientId: number, file: File): Observable<any> {
//   const formData = new FormData();

//   // Add user ID to file name, e.g., "123_originalFileName.pdf"
//   const fileNameWithUserId = `${patientId}_${file.name}`;

//   // Create a new File object with the modified name
//   const newFile = new File([file], fileNameWithUserId, { type: file.type });

//   formData.append('patientId', patientId.toString()); // still pass patientId
//   formData.append('file', newFile);

//   return this.http.post(`${this.apiUrl}/upload`, formData);
// }

//   // Get single report as Blob
//   getReport(reportId: number): Observable<Blob> {
//     return this.http.post(`${this.apiUrl}/get-report`, reportId, { responseType: 'blob' });
//   }

//   // Get reports by patient (default to logged-in user if patientId not provided)
//   getReportsByPatient(patientId?: number): Observable<MedicalReport[]> {
//     const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
//     const id = patientId || user.id;
//     return this.http.post<MedicalReport[]>(`${this.apiUrl}/get-reports-by-patient`, id);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments.prod';

export interface MedicalReport {
  reportId: number;
  patientId: number;
  reportName: string;
  fileType: string;
  uploadedOn: string;
  fileData?: any; // byte[] from backend
}

@Injectable({
  providedIn: 'root'
})
export class MedicalReportService {
  private apiUrl = `${environment.apiUrl}MedicalReport`;

  constructor(private http: HttpClient) {}

  // Upload PDF
  uploadReport(patientId: number, file: File): Observable<any> {
    const formData = new FormData();
    const fileNameWithUserId = `${patientId}_${file.name}`;
    const newFile = new File([file], fileNameWithUserId, { type: file.type });
    formData.append('patientId', patientId.toString());
    formData.append('file', newFile);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  // Get single report as Blob
  getReport(reportId: number): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/get-report`, reportId, { responseType: 'blob' });
  }

  // Get reports by patient (default to logged-in user if patientId not provided)
  getReportsByPatient(patientId?: number): Observable<MedicalReport[]> {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const id = patientId || user.id;
    return this.http.post<MedicalReport[]>(`${this.apiUrl}/get-reports-by-patient`, id);
  }
}

