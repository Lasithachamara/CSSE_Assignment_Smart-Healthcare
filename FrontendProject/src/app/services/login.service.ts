import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environments.prod';
import { User } from '../Models/user.model'; // ← single source of truth

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  currentUser: User | null = null;

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(username: string, password: string): Observable<User> {
    const body = { username, password };
    return this.http.post<User>(`${environment.apiUrl}LogIn/login`, body).pipe(
      tap(user => {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
