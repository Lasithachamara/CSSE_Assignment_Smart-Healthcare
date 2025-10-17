import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../Models/user.model';
import { UserDetailService } from '../../../services/user-details.service';

@Component({
  selector: 'app-patient-dashboard',
  imports: [],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css'
})
export class PatientDashboard {

  userId!: number;
  user!: User;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private userDetailService: UserDetailService
  ) {}

  ngOnInit(): void {
    // this.userId = Number(this.route.snapshot.paramMap.get('id'));
    const idStr = localStorage.getItem('id');
    this.userId = idStr ? Number(idStr) : 0;
    // this.userId=1003
    this.loadUser();
  }

  loadUser() {
  const savedUserJson = localStorage.getItem('currentUser');

  if (!savedUserJson) {
    this.message = 'User not found in localStorage.';
    return;
  }

  try {
    const savedUser = JSON.parse(savedUserJson);
    const userId = Number(savedUser.id); // ensure number

    if (isNaN(userId)) {
      this.message = 'Invalid user ID.';
      return;
    }

    this.userDetailService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: () => this.message = 'Failed to load user details.'
    });
  } catch {
    this.message = 'Failed to parse user data from localStorage.';
  }
}
}
