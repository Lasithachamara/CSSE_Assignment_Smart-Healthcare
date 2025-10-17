import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { User } from '../../../Models/user.model';
import { UserDetailService } from '../../../services/user-details.service';
import { AppointmentService, Department, Doctor, Appointment } from '../../../services/appointment.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./add-appointment.css']
})
export class AddAppointment implements OnInit {
  departments: Department[] = [];
  doctors: Doctor[] = [];
  selectedDepartmentId: number | null = null;
  selectedTimeSlot: string = '';

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

  appointment: Appointment = {
    userId: 1, // ✅ Replace with logged-in user ID
    doctorId: 0,
    preferredDate: '',
    availableTimeSlots: '',
    reasonforVisit: ''
  };

  constructor(private appointmentService: AppointmentService,private router: Router,
      private userDetailService: UserDetailService) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.appointmentService.getAllDepartments().subscribe({
      next: (res) => this.departments = res,
      error: (err) => console.error('Failed to load departments', err)
    });
  }

  onDepartmentChange(): void {
    if (this.selectedDepartmentId) {
      this.appointmentService.getDoctorsByDepartment(this.selectedDepartmentId).subscribe({
        next: (res) => this.doctors = res,
        error: (err) => console.error('Failed to load doctors', err)
      });
    } else {
      this.doctors = [];
    }
  }

  selectTimeSlot(slot: string): void {
    this.selectedTimeSlot = slot;
    this.appointment.availableTimeSlots = slot;
  }

 bookAppointment(): void {
  const today = new Date();
  const selectedDate = new Date(this.appointment.preferredDate);

  // Check required fields
  if (!this.appointment.doctorId || !this.appointment.preferredDate || !this.selectedTimeSlot) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      text: 'Please fill in all required fields.',
    });
    return;
  }

  // Prevent past date
  if (selectedDate < new Date(today.setHours(0, 0, 0, 0))) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Date',
      text: 'You cannot select a past date.',
    });
    return;
  }

  // Book appointment
  this.appointmentService.createAppointment(this.appointment).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Appointment Booked!',
        text: 'Your appointment has been successfully scheduled.',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        this.router.navigate(['/appointment']); // navigate after success  
      });
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: 'Failed to book appointment: ' + err.message,
      });
    }
  });
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
    }else{
      this.appointment.userId = userId; 
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
    if (page === 'BacktoDashboard') {
      this.router.navigate(['/patient-dashboard']);
    }
  }

}