import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddUserService } from '../../../services/add-user.service';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-user.html',
  styleUrls: ['./register-user.css']
})
export class RegisterUserComponent implements OnInit {

  user: any = {
    id: 0,
    nic: '',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    accessLevel: 1, 
    activeStatus: true,
    mobile: '',
    createdBy: '',
    createdDate: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    emergencyContactNo: '',
    address: '',
    bloodType: '',
    qrcode: ''
  };

  confirmPassword: string = ''; 
  message: string = '';         
  loading: boolean = false;     

  accessLevels = [
  { label: 'Patient', value: 1 },
  { label: 'Hospital User', value: 2 },
  { label: 'Doctor', value: 3 }
];

  constructor(
    private userService: AddUserService,
    private loginService: LoginService,
    private router: Router         
  ) {}

  ngOnInit(): void {


  }

  onSubmit(registerForm: NgForm): void {
  if (registerForm.invalid) {
    this.message = 'Please fill all required fields.';
    return;
  }

  if (this.user.password !== this.confirmPassword) {
    this.message = 'Passwords do not match.';
    return;
  }



const currentUserJson = localStorage.getItem('currentUser');
const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
const name1 = currentUser ? currentUser.userName : 'Unknown';


  const payload = {
    ...this.user,

    createdBy: name1,
    createdDate: new Date().toISOString(),
    accessLevel: Number(this.user.accessLevel), 
    dateOfBirth: new Date(this.user.dateOfBirth).toISOString() 
  };

  console.log('Payload to send:', payload);

  this.loading = true;
  this.message = '';

  this.userService.createUser(payload).subscribe({
    next: () => {
      this.message = 'User registered successfully!';
      this.loading = false;
      registerForm.resetForm();
      setTimeout(() => this.router.navigate(['/show-users']), 1500);
    },
    error: (err) => {
      console.error('Error creating user:', err);
      this.message = 'Failed to create user. Please try again.';
      this.loading = false;
    }
  });
}


  goTo(page: string): void {
    this.router.navigate([page]);
  }
}
