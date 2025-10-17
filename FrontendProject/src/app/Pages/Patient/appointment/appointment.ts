import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppointmentService, Appointment } from '../../../services/appointment.service';
import { User } from '../../../Models/user.model';
import { UserDetailService } from '../../../services/user-details.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./appointment.css']
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  user?: User;  // Make optional to handle undefined safely
  message = '';

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private userDetailService: UserDetailService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const savedUserJson = localStorage.getItem('currentUser');
    if (!savedUserJson) {
      this.message = 'User not found in localStorage.';
      return;
    }

    try {
      const savedUser = JSON.parse(savedUserJson);
      const userId = Number(savedUser.id);

      if (isNaN(userId)) {
        this.message = 'Invalid user ID.';
        return;
      }

      this.userDetailService.getUserById(userId).subscribe({
        next: (user: User) => {
          this.user = user;
          this.loadAppointments(user.id);
        },
        error: () => this.message = 'Failed to load user details.'
      });
    } catch {
      this.message = 'Failed to parse user data from localStorage.';
    }
  }

  loadAppointments(userId: number): void {
    this.appointmentService.getAppointmentsByUser(userId).subscribe({
      next: (res: Appointment[]) => {
        this.appointments = res ?? [];
      },
      error: (err) =>
        Swal.fire('Error', 'Failed to load appointments: ' + err.message, 'error')
    });
  }

  addAppointment(): void {
    this.router.navigate(['/add-appointment']);
  }

  updateAppointment(appointmentId: number): void {
    this.router.navigate(['/appointment/update', appointmentId]);
  }

  cancelAppointment(appointmentId: number): void {
    Swal.fire({
      title: 'Cancel Appointment?',
      text: 'Are you sure you want to cancel this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.cancelAppointment(appointmentId).subscribe({
          next: () => {
            Swal.fire('Cancelled!', 'Your appointment has been cancelled.', 'success');
            this.appointments = this.appointments.filter(a => a.id !== appointmentId);
          },
          error: (err) =>
            Swal.fire('Error', 'Failed to cancel appointment: ' + err.message, 'error')
        });
      }
    });
  }
  goTo(page: string) {
    if (page === 'BacktoDashboard') {
      this.router.navigate(['/patient-dashboard']);
    }
  }

  showPopup = false;

showContactPopup(): void {
  this.showPopup = true;
}

closePopup(): void {
  this.showPopup = false;
}
}
