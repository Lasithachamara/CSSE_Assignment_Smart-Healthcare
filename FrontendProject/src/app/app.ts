import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../app/Pages/navbar/navbar';
import { DoctorNavbarComponent } from '../app/Pages/Doctor-navbar/Doctor-navbar';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, DoctorNavbarComponent, NgIf],
  template: `
    <!-- ✅ Hide navbar if user AccessLevel = 2 or on login page -->
   
    <app-doctor-navbar *ngIf="!doctorHideNavbar"></app-doctor-navbar>
     <app-navbar *ngIf="!hideNavbar"></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    h1 {
      text-align: center;
      color: #2c3e50;
    }
  `]
})
export class AppComponent {
  hideNavbar = false;
  doctorHideNavbar = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const userData = localStorage.getItem('currentUser');
        let accessLevel = 0;

        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            accessLevel = parsedUser.accessLevel || parsedUser.AccessLevel || 0;
          } catch (e) {
            console.warn('Invalid user data in localStorage');
          }
        }

        // ✅ Hide if user is AccessLevel 2 OR on login route
        this.hideNavbar = accessLevel === 2 || event.urlAfterRedirects === '/';
        this.doctorHideNavbar = accessLevel == 2 || accessLevel == 1 || event.urlAfterRedirects === '/';
      });
  }
}
