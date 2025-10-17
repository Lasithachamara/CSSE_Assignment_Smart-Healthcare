import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../../Models/user.model';
import { UserDetailService } from '../../../services/user-details.service';

@Component({
  selector: 'app-user-wise-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-wise-details.html',
  styleUrls: ['./user-wise-details.css']
})
export class UserWiseDetails implements OnInit {
  userId!: number;
  user!: User;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private userDetailService: UserDetailService,
    private router: Router
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
goTo(page: string) {
    if (page === 'EditProfile') {
      this.router.navigate(['/edit-profile-details']); 
    } else if (page === 'BacktoDashboard') {
      this.router.navigate(['/patient-dashboard']);
    }else if (page === 'AddMedicalReport') {
      this.router.navigate(['/add-medical-report']);
    }else if (page === 'ViewMedicalHistory') {
      this.router.navigate(['/MedicalHistory']);
    }

    
  }

}
