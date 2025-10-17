import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppointmentService, Appointments } from '../../../services/appointment.service';

@Component({
  selector: 'app-patient-check-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-check-in.html',
  styleUrl: './patient-check-in.css'
})
export class PatientCheckIn implements OnInit {
  appointments: Appointments[] = [];
  filteredAppointments: Appointments[] = [];
  filterStatus: string = '';
  searchTerm: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllAppointments();
  }

  loadAllAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data: Appointments[]) => {
        this.appointments = data || [];
        this.filteredAppointments = [...this.appointments];
        console.log('Loaded appointments:', this.appointments);
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        Swal.fire('Error', 'Failed to load appointments.', 'error');
      }
    });
  }

  applyFilter(): void {
    this.filteredAppointments = this.appointments.filter(appt => {
      let matches = true;

      if (this.filterStatus && this.filterStatus !== '') {
        matches = matches && appt.status === this.filterStatus;
      }

      if (this.searchTerm && this.searchTerm.trim() !== '') {
        const patientName = (appt.patientName || '').toLowerCase();
        const search = this.searchTerm.toLowerCase().trim();
        matches = matches && patientName.includes(search);
      }

      return matches;
    });
  }

  checkInPatient(appointment: Appointments): void {
    if (appointment.status !== 'Confirmed') {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Check In',
        text: 'Only confirmed appointments can be checked in.',
        confirmButtonColor: '#e9b86d'
      });
      return;
    }

    if (appointment.checkIn === true) {
      Swal.fire({
        icon: 'info',
        title: 'Already Checked In',
        text: 'This patient has already been checked in.',
        confirmButtonColor: '#e9b86d'
      });
      return;
    }

    Swal.fire({
      title: 'Check In Patient?',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Patient:</strong> ${appointment.patientName || 'N/A'}</p>
          <p><strong>Doctor:</strong> ${appointment.doctorName || 'N/A'}</p>
          <p><strong>Time:</strong> ${appointment.availableTimeSlots || 'N/A'}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '✓ Check In',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#7db387',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.performCheckIn(appointment);
      }
    });
  }

  performCheckIn(appointment: Appointments): void {
    this.appointmentService.checkInAppointment(appointment.id!).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Check-In Successful!',
          text: `${appointment.patientName} has been checked in.`,
          timer: 2000,
          showConfirmButton: false
        });

        const index = this.appointments.findIndex(a => a.id === appointment.id);
        if (index !== -1) {
          this.appointments[index].status = 'Completed';
          this.appointments[index].checkIn = true;
        }

        this.applyFilter();
      },
      error: (err) => {
        console.error('Check-in error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Check-In Failed',
          text: err.error?.message || 'Failed to check in patient. Please try again.',
          confirmButtonColor: '#c36b6b'
        });
      }
    });
  }

  viewDetails(appointment: Appointments): void {
    const appointmentDate = new Date(appointment.preferredDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    Swal.fire({
      title: '📋 Appointment Details',
      html: `
        <div style="text-align: left; padding: 15px;">
          <p style="margin: 8px 0;"><strong>ID:</strong> ${appointment.id}</p>
          <p style="margin: 8px 0;"><strong>Patient:</strong> ${appointment.patientName || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Doctor:</strong> ${appointment.doctorName || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Department:</strong> ${appointment.departmentName || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${appointmentDate}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${appointment.availableTimeSlots || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Status:</strong> 
            <span style="color: ${this.getStatusColor(appointment.status)}; font-weight: bold;">
              ${appointment.status || 'Pending'}
            </span>
          </p>
          <p style="margin: 8px 0;"><strong>Checked In:</strong> 
            <span style="color: ${appointment.checkIn ? '#28a745' : '#dc3545'}; font-weight: bold;">
              ${appointment.checkIn ? 'Yes' : 'No'}
            </span>
          </p>
          ${appointment.reasonforVisit ? `<p style="margin: 8px 0;"><strong>Reason:</strong> ${appointment.reasonforVisit}</p>` : ''}
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#e9b86d',
      width: '500px'
    });
  }

  getStatusColor(status: string | undefined): string {
    switch(status) {
      case 'Confirmed': return '#ffc107';
      case 'Completed': return '#28a745';
      case 'Pending': return '#17a2b8';
      case 'Cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }

  getCountByStatus(status: string): number {
    return this.appointments.filter(a => a.status === status).length;
  }

  getCheckedInCount(): number {
    return this.appointments.filter(a => a.checkIn === true).length;
  }

  goToHome(): void {
    this.router.navigate(['/dashboard']);
  }
}