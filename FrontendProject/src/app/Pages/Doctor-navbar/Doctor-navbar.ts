import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgForOf } from '@angular/common'; // ✅ Needed for *ngIf & *ngFor
import { UserDetailService } from '../../services/user-details.service';
import { User } from '../../Models/user.model';

@Component({
  selector: 'app-doctor-navbar',
  templateUrl: './Doctor-navbar.html',
  styleUrls: ['./Doctor-navbar.css'],
  standalone: true,
  imports: [NgIf, NgForOf]
})
export class DoctorNavbarComponent implements OnInit {
  dropdownOpen: string | null = null;
  users: User[] = [];

  constructor(private router: Router, private userService: UserDetailService) {}

  ngOnInit(): void {
    // ✅ Fetch all users via POST
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        // Filter AccessLevel = 2 users
        this.users = data.filter(u => u.accessLevel === 2);
        console.log('AccessLevel=2 users:', this.users);
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  toggleDropdown(menu: string, isOpen: boolean) {
    this.dropdownOpen = isOpen ? menu : null;
  }

  onSelectUser(event: any) {
    const selectedUserId = event.target.value;
   
    if (selectedUserId !== '') {
    localStorage.removeItem('selectedUserId');
  }
    if (selectedUserId) {
      localStorage.setItem('selectedUserId', selectedUserId);
      console.log('Selected User ID saved to localStorage:', selectedUserId);
    }
  }

  // ✅ Patient Management navigation
  goToMedicalHistory() { this.router.navigate(['/view-medical-history']); }
  goToaddmedicalreport() { this.router.navigate(['/add-medical-report']); }
  goToaddmedicalhistory() { this.router.navigate(['/add-medical-history']); }
  goToPatientReports() { this.router.navigate(['/view-patient-reports']); }
}
