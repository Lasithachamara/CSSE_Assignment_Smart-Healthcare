import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  dropdownOpen: string | null = null;
  states: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedState = localStorage.getItem('states');
    this.states = storedState ? parseInt(storedState, 10) : 0;
  }

  toggleDropdown(menu: string, isOpen: boolean) {
    this.dropdownOpen = isOpen ? menu : null;
  }

  goHome() { this.router.navigate(['Home']);  localStorage.removeItem('selectedUserId');}
  goToAddUser() { this.router.navigate(['/RegisterUser']); }
  goToUserList() { this.router.navigate(['/show-users']); }
  goTopatientCheckIn() { this.router.navigate(['/patient-check-in']); }
  goTopatientAppointmentConfirm() { this.router.navigate(['/patient-appointment-confirm']); }
  
  goToLogin() { localStorage.removeItem('currentUser');this.router.navigate(['']); }
}