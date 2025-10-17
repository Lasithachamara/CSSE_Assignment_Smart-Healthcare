import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddUserService } from '../../../services/add-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfileComponent implements OnInit {
  user: any = {
    id: 0,
    nic: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    emergencyContactNo: '',
    address: '',
    bloodType: '',
    email: '',
    mobile: '',
    activeStatus: true
  };

  message = '';

  constructor(private AddUserService: AddUserService, private router: Router) {}

  ngOnInit(): void {
    // Get current user info from localStorage or API
    const savedUserJson = localStorage.getItem('currentUser');
    if (savedUserJson) {
      const currentUser = JSON.parse(savedUserJson);
      this.user = { ...this.user, ...currentUser };
    }

    // Fetch latest user info from API
    if (this.user.id) {
      this.AddUserService.getUserById(this.user.id).subscribe({
        next: (data) => {
    if (data.dateOfBirth) data.dateOfBirth = data.dateOfBirth.split('T')[0];
    if (data.bloodType) data.bloodType = data.bloodType.trim();
    this.user = data;
  },
  error: () => (this.message = 'Failed to load user details.')
      });
    }
  }

  onSubmit(form: NgForm) {
    this.message = '';

    if (form.invalid) {
      this.message = 'Please fill in all required fields.';
      return;
    }

    this.AddUserService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        this.message = 'Profile updated successfully!';
        localStorage.setItem('currentUser', JSON.stringify(this.user));
        setTimeout(() => this.router.navigate(['/Home']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.message = err.error?.message || 'Error updating profile. Try again.';
      }
    });
  }
  goTo(page: string) {
    if (page === 'BacktoDashboard') {
      this.router.navigate(['/patient-dashboard']);
    }
  }
}
