import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user.model';
import { environment } from '../environments/environments.prod';



@Injectable({ providedIn: 'root' })
export class UserService {
  // getUserById(userId: number) {
  //   throw new Error('Method not implemented.');
  // }
  // updateUser(arg0: any) {
  //   throw new Error('Method not implemented.');
  // }

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
  return this.http.post<User[]>(`${environment.apiUrl}Users/getall`, {}); 
}

  deleteUser(id: number): Observable<any> {
  const params = new HttpParams().set('id', id.toString());
  return this.http.post(`${environment.apiUrl}Users/delete`, null, { params });
}

updateUser(userData: any, payload: { password: any; }): Observable<any> {
    // Extract id from userData and keep the rest as dto
    const { id, ...dto } = userData;

    // Set id as query parameter
    const params = new HttpParams().set('id', id.toString());

    console.log('Updating user:', userData); // Debug log

    // Send POST request
    return this.http.post(`${environment.apiUrl}Users/update`, dto, { params });
  }
  getUserById(id: number): Observable<User> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.post<User>(`${environment.apiUrl}Users/getbyid`, null, { params });
  }

  updateUserPassword(userId: number, newPassword: string): Observable<any> {
  // Include userId in the payload so backend knows which user to update
  const payload = { userId, password: newPassword };

  // Send POST request to backend endpoint
  return this.http.post(`${environment.apiUrl}Users/update-password`, payload);
}

}
