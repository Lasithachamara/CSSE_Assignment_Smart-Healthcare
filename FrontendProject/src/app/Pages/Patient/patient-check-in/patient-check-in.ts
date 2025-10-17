import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppointmentService, Appointment } from '../../../services/appointment.service';

@Component({
  selector: 'app-patient-check-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-check-in.html',
  styleUrl: './patient-check-in.css'
})
export class PatientCheckIn implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  filterStatus: string = '';
  searchTerm: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllAppointments();
  }

  // Load all appointments with full details
  loadAllAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data: Appointment[]) => {
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

  // Apply filters
  applyFilter(): void {
    this.filteredAppointments = this.appointments.filter(appt => {
      let matches = true;

      // Filter by status
      if (this.filterStatus && this.filterStatus !== '') {
        matches = matches && appt.status === this.filterStatus;
      }

      // Filter by patient name
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        const patientName = (appt.patientName || '').toLowerCase();
        const search = this.searchTerm.toLowerCase().trim();
        matches = matches && patientName.includes(search);
      }

      return matches;
    });
  }

  // Check in patient
  checkInPatient(appointment: Appointment): void {
    // Validate: Only Confirmed appointments can be checked in
    if (appointment.status !== 'Confirmed') {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Check In',
        text: 'Only confirmed appointments can be checked in.',
        confirmButtonColor: '#e9b86d'
      });
      return;
    }

    // Check if already checked in
    if (appointment.checkIn === true) {
      Swal.fire({
        icon: 'info',
        title: 'Already Checked In',
        text: 'This patient has already been checked in.',
        confirmButtonColor: '#e9b86d'
      });
      return;
    }

    // Confirm check-in
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

  // Perform the check-in operation using the dedicated endpoint
  performCheckIn(appointment: Appointment): void {
    this.appointmentService.checkInAppointment(appointment.id!).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Check-In Successful!',
          text: `${appointment.patientName} has been checked in.`,
          timer: 2000,
          showConfirmButton: false
        });

        // Update local data
        const index = this.appointments.findIndex(a => a.id === appointment.id);
        if (index !== -1) {
          this.appointments[index].status = 'Completed';
          this.appointments[index].checkIn = true;
        }

        // Reapply filters
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

  // View appointment details
  viewDetails(appointment: Appointment): void {
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

  // Get status color
  getStatusColor(status: string | undefined): string {
    switch(status) {
      case 'Confirmed': return '#ffc107';
      case 'Completed': return '#28a745';
      case 'Pending': return '#17a2b8';
      case 'Cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }

  // Get count by status
  getCountByStatus(status: string): number {
    return this.appointments.filter(a => a.status === status).length;
  }

  // Get checked in count
  getCheckedInCount(): number {
    return this.appointments.filter(a => a.checkIn === true).length;
  }

  // Navigate to home
  goToHome(): void {
    this.router.navigate(['/dashboard']);
  }
}