import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddUser } from '../Models/AddUser.model';
import { environment } from '../environments/environments.prod';

import { User } from '../Models/user.model';

export interface UserDto {
  id?: number;
  nic: string;
  firstName: string;
  userName: string;
  email: string;
  password: string;
  accessLevel: number;
  activeStatus: boolean;
  mobile: string;
  createdBy: string;
  createdDate: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  emergencyContactNo: string;
  address?: string;
  bloodType?: string;
  qrcode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddUserService {

  constructor(private http: HttpClient) {}
  
 addUser(user: any) {
    return this.http.post<any>(`${environment.apiUrl}Users/create`, user);
  }
  getUserlevel(): Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiUrl}Users/getallUserlevel`, {});
  }

  // getUserById(id: number): Observable<any> {
  //   return this.http.post<any>(`${environment.apiUrl}Users/getbyid`, { id });
  // }
  getUserById(id: number): Observable<User> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.post<User>(`${environment.apiUrl}Users/getbyid`, null, { params });
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}Users/update?id=${id}`, user);
  }

createUser(user: UserDto): Observable<any> {
  const payload = {
    id: user.id,
    nic: user.nic,
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    password: user.password,
    accessLevel: user.accessLevel,
    activeStatus: user.activeStatus,
    mobile: user.mobile,
    createdBy: user.createdBy, // set from current user
    createdDate: user.createdDate || new Date().toISOString(),
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    contactNumber: user.contactNumber,
    emergencyContactNo: user.emergencyContactNo,
    address: user.address,
    bloodType: user.bloodType,
    qrcode: user.qrcode
  };

  console.log('Creating user with payload:', payload); // Debug log

  return this.http.post(`${environment.apiUrl}Users/create`, payload);
}

}
