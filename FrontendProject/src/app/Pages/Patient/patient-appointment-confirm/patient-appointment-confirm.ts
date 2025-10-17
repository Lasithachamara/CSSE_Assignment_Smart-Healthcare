import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppointmentService, Appointment } from '../../../services/appointment.service';

@Component({
  selector: 'app-patient-appointment-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-appointment-confirm.html',
  styleUrl: './patient-appointment-confirm.css'
})
export class PatientAppointmentConfirm implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  filterStatus: string = '';
  searchTerm: string = '';
  filterDate: string = '';

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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load appointments.',
          confirmButtonColor: '#e9b86d'
        });
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

      // Filter by date
      if (this.filterDate && this.filterDate !== '') {
        const apptDate = new Date(appt.preferredDate).toISOString().split('T')[0];
        matches = matches && apptDate === this.filterDate;
      }

      return matches;
    });
  }

  // Confirm appointment
  confirmAppointment(appointment: Appointment): void {
    // Validate: Only Pending appointments can be confirmed
    if (appointment.status !== 'Pending') {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Confirm',
        text: 'Only pending appointments can be confirmed.',
        confirmButtonColor: '#e9b86d'
      });
      return;
    }

    // Confirm action
    Swal.fire({
      title: 'Confirm Appointment?',
      html: `
        <div style="text-align: left; padding: 15px;">
          <p style="margin: 8px 0;"><strong>Patient:</strong> ${appointment.patientName || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Doctor:</strong> ${appointment.doctorName || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Department:</strong> ${appointment.departmentName || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date(appointment.preferredDate).toLocaleDateString()}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${appointment.availableTimeSlots || 'N/A'}</p>
        </div>
        <p style="margin-top: 15px; color: #666;">Are you sure you want to confirm this appointment?</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '✓ Confirm Appointment',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#7db387',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.performConfirm(appointment);
      }
    });
  }

  // Perform the confirmation
  performConfirm(appointment: Appointment): void {
    // Update appointment status to Confirmed (checkIn remains unchanged)
    const updatedAppointment: Appointment = {
      ...appointment,
      status: 'Confirmed'
      // checkIn field is NOT updated here
    };

    this.appointmentService.updateAppointment(appointment.id!, updatedAppointment).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Appointment Confirmed!',
          text: `Appointment for ${appointment.patientName} has been confirmed.`,
          timer: 2000,
          showConfirmButton: false
        });

        // Update local data
        const index = this.appointments.findIndex(a => a.id === appointment.id);
        if (index !== -1) {
          this.appointments[index].status = 'Confirmed';
        }

        // Reapply filters
        this.applyFilter();
      },
      error: (err) => {
        console.error('Confirm error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Confirmation Failed',
          text: 'Failed to confirm appointment. Please try again.',
          confirmButtonColor: '#c36b6b'
        });
      }
    });
  }

  // Cancel appointment
  cancelAppointment(appointment: Appointment): void {
    // Validate: Only Pending appointments can be cancelled
    if (appointment.status !== 'Pending') {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Cancel',
        text: 'Only pending appointments can be cancelled.',
        confirmButtonColor: '#e9b86d'
      });
      return;
    }

    // Confirm cancellation
    Swal.fire({
      title: 'Cancel Appointment?',
      html: `
        <div style="text-align: left; padding: 15px;">
          <p style="margin: 8px 0;"><strong>Patient:</strong> ${appointment.patientName || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Doctor:</strong> ${appointment.doctorName || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date(appointment.preferredDate).toLocaleDateString()}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${appointment.availableTimeSlots || 'N/A'}</p>
        </div>
        <p style="margin-top: 15px; color: #dc3545; font-weight: bold;">
          This action cannot be undone. Are you sure?
        </p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '✗ Yes, Cancel It',
      cancelButtonText: 'No, Keep It',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.performCancel(appointment);
      }
    });
  }

  // Perform the cancellation
  performCancel(appointment: Appointment): void {
    // Update appointment status to Cancelled (checkIn remains unchanged)
    const updatedAppointment: Appointment = {
      ...appointment,
      status: 'Cancelled'
      // checkIn field is NOT updated here
    };

    this.appointmentService.updateAppointment(appointment.id!, updatedAppointment).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Appointment Cancelled',
          text: `Appointment for ${appointment.patientName} has been cancelled.`,
          timer: 2000,
          showConfirmButton: false
        });

        // Update local data
        const index = this.appointments.findIndex(a => a.id === appointment.id);
        if (index !== -1) {
          this.appointments[index].status = 'Cancelled';
        }

        // Reapply filters
        this.applyFilter();
      },
      error: (err) => {
        console.error('Cancel error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Cancellation Failed',
          text: 'Failed to cancel appointment. Please try again.',
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
          <p style="margin: 8px 0;"><strong>Appointment ID:</strong> ${appointment.id}</p>
          <p style="margin: 8px 0;"><strong>Patient Name:</strong> ${appointment.patientName || 'N/A'}</p>
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
          ${appointment.reasonforVisit ? `<p style="margin: 8px 0;"><strong>Reason for Visit:</strong> ${appointment.reasonforVisit}</p>` : ''}
          ${appointment.createdDate ? `<p style="margin: 8px 0; font-size: 0.85rem; color: #666;"><strong>Created:</strong> ${new Date(appointment.createdDate).toLocaleString()}</p>` : ''}
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#e9b86d',
      width: '550px'
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

  // Navigate to home
  goToHome(): void {
    this.router.navigate(['/dashboard']);
  }
}