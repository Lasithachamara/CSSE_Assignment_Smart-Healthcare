import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../Models/customer.model';
import { environment } from '../environments/environments.prod';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<Customer[]> {
    return this.http.post<Customer[]>(`${environment.apiUrl}Customers/Get_All_Customer_Details`, null);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.post<Customer>(`${environment.apiUrl}Customers/Get_Customer_By_Id`, { id });
  }

  createCustomer(customer: Customer): Observable<Customer> {
    const payload = {
    nic: customer.nic,
    name: customer.name,
    mobileNo: customer.mobileNo,
    createdBy: customer.createdBy,
    createdDate: new Date().toISOString(),
    isActive: true
  };
    return this.http.post<Customer>(`${environment.apiUrl}Customers/Post_Customer`, payload);
  }

  updateCustomer(customer: Customer): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}Customers/Update_Customer_Details?id=${customer.id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}Customers/Delete_Customer_Details`, { id });
  }
}
