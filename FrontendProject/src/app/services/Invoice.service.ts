import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../Models/invoice.model';
import { Item } from '../Models/item.model';
import { InvoiceWithDetailsDTO } from '../Models/InvoiceWithDetailsDTO';
import { environment } from '../environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<Invoice[]> {
    return this.http.post<Invoice[]>(`${environment.apiUrl}Invoice/invoice_list`, {});
  }

  getItems(): Observable<Item[]> {
    return this.http.post<Item[]>(`${environment.apiUrl}Item/list`, {});
  }

  getCustomers(): Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiUrl}Customers/Get_All_Customer_Details`, {});
  }

  getLastInvoiceNo(): Observable<number> {
    return this.http.post<number>(`${environment.apiUrl}Invoice/GetLastInvoiceNo`, {});
  }

  saveInvoice(invoice: any) {
    return this.http.post(`${environment.apiUrl}Invoice/Post_Invoice`, invoice);
  }

  saveInvoiceHeader(invoiceHeaderDto: any) {
    return this.http.post<any>(`${environment.apiUrl}Invoice/Post_Invoice`, invoiceHeaderDto);
  }

  addInvoiceItem(invoiceDetailDto: any) {
    return this.http.post<any>(`${environment.apiUrl}Invoice/Add_Invoice_Details`, invoiceDetailDto);
  }
  getInvoiceItems(invoiceNo: string): Observable<Item[]> {
  const url = `${environment.apiUrl}Invoice/Invoice_Details/?invoiceNo=${invoiceNo}`;
  return this.http.post<Item[]>(url, {}); 
}
deleteInvoice(invoiceNo: string): Observable<void> {
  return this.http.post<void>(
    `${environment.apiUrl}Invoice/Delete_Invoice/${invoiceNo}`, null );
}

createInvoiceWithDetails(invoiceWithDetailsDTO: InvoiceWithDetailsDTO): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}Invoice/CreateInvoiceWithDetails`, invoiceWithDetailsDTO);
  }

}
