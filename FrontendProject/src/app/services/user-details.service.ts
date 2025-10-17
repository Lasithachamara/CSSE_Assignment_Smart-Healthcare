import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user.model';
import { environment } from '../environments/environments.prod';

@Injectable({ providedIn: 'root' })
export class UserDetailService {

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<User> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.post<User>(`${environment.apiUrl}Users/getbyid`, null, { params });
  }

  updateUser(userData: any): Observable<any> {
    const params = new HttpParams().set('id', userData.id.toString());
    const { id, ...dto } = userData;
    console.log('User object:', userData);
    return this.http.post(`${environment.apiUrl}Users/update`, dto, { params });
  }

  getAllUsers(): Observable<User[]> {
  // Sending null as body because your backend might not require it
  return this.http.post<User[]>(`${environment.apiUrl}Users/getallAppointmentUser`, {});
}

}