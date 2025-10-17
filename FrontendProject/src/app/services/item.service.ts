import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item} from '../Models/item.model';
import { environment } from '../environments/environments.prod';

@Injectable({
  providedIn: 'root',
})
export class ItemService {

  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.post<Item[]>(`${environment.apiUrl}item/list`, {});
  }

  getItem(id: number): Observable<Item> {
    return this.http.post<Item>(`${environment.apiUrl}item/get`, { id });
  }

  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(`${environment.apiUrl}item/create`, item);
  }

  updateItem(item:Item): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}item/update?id=${item.id}`, item);
  }

  deactivateItem(id: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}item/deactivate`, { id });
  }
}
