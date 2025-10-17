import { Component } from '@angular/core';
import { AddUserService } from '../../../services/add-user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddUser } from '../../../Models/AddUser.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.css']
})
export class AddUserComponent {
  user: AddUser = {
    nic: '',
    name: '',
    userName: '',
    email: '',
    password: '',
    accessLevel: 0,
    activeStatus: true,
    mobile: '',
    createdBy: 'Admin',
    createdDate: new Date().toISOString()
  };

  message = '';
  UserLevel: any[] = [];
  selectedUserLevelId: string = '';

  constructor(private router: Router, private addUserService: AddUserService) {}

  ngOnInit(): void {
    this.addUserService.getUserlevel().subscribe({
      next: (data) => this.UserLevel = data,
      error: (err) => console.error('Error fetching user levels:', err)
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Helper functions for frontend validation
  isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
  }

  isValidMobile(mobile: string) {
    const regex = /^07[0-9]{8}$/;
    return regex.test(mobile);
  }

  isValidNIC(nic: string) {
    const regex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    return regex.test(nic);
  }

  onSubmit(form: NgForm) {
    this.message = '';

    if (!this.user.userName || !this.user.password || !this.user.nic || !this.user.name ||
        !this.user.email || !this.user.mobile || !this.selectedUserLevelId) {
      this.message = 'All fields are required!';
      return;
    }

    if (!this.isValidEmail(this.user.email)) {
      this.message = 'Invalid email address!';
      return;
    }

    if (!this.isValidMobile(this.user.mobile)) {
      this.message = 'Invalid mobile number! Use format 07XXXXXXXX';
      return;
    }

    if (!this.isValidNIC(this.user.nic)) {
      this.message = 'Invalid NIC! Use valid Sri Lankan NIC';
      return;
    }

    this.user.accessLevel = Number(this.selectedUserLevelId);
    const savedUserJson = localStorage.getItem('currentUser');
    this.user.createdBy = 'Unknown';
    if (savedUserJson) {
      try {
        const loggedIn = JSON.parse(savedUserJson);
        this.user.createdBy = loggedIn.name || 'Unknown';
      } catch {}
    }

    this.addUserService.addUser(this.user).subscribe({
      next: () => {
        this.message = 'User added successfully!';
        form.resetForm();
        this.router.navigate(['/show-users']);
      },
      error: (err) => {
        console.error(err);
        if (err.error && err.error.message) {
          this.message = err.error.message;  
        } else {
          this.message = 'Error adding user. Please try again.';
        }
      }
    });
  }
}
