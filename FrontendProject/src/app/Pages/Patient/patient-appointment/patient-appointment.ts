import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppointmentService, Appointments } from '../../../services/appointment.service';
import { User } from '../../../Models/user.model';
import { UserDetailService } from '../../../services/user-details.service';
import { FormsModule } from '@angular/forms';

interface FilterCriteria {
  doctorName: string;
  departmentName: string;
  preferredDate: string;
  status: string;
}

@Component({
  selector: 'app-appointment',
  templateUrl: './patient-appointment.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./patient-appointment.css']
})
export class PatientAppointment implements OnInit {
  appointments: Appointments[] = [];
  filteredAppointments: Appointments[] = [];
  user?: User;
  message = '';

  filterCriteria: FilterCriteria = {
    doctorName: '',
    departmentName: '',
    preferredDate: '',
    status: ''
  };

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
      Swal.fire('Error', 'Please login to view appointments.', 'error');
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
          console.log('User loaded:', user);
          this.loadAppointments(user.id);
        },
        error: () => {
          this.message = 'Failed to load user details.';
          console.error('Failed to load user');
        }
      });
    } catch {
      this.message = 'Failed to parse user data from localStorage.';
    }
  }

  loadAppointments(userId: number): void {
    console.log('Loading appointments for user ID:', userId);
    
    this.appointmentService.getAppointmentsByUser(userId).subscribe({
      next: (res: Appointments[]) => {
        this.appointments = res ?? [];
        this.filteredAppointments = [...this.appointments];
        console.log('Loaded appointments:', this.appointments);
        console.log('Total appointments:', this.appointments.length);
        
 
        if (this.appointments.length > 0) {
          console.log('Sample appointment data:', this.appointments[0]);
        }
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        Swal.fire('Error', 'Failed to load appointments: ' + err.message, 'error');
      }
    });
  }


  onFilterChange(): void {

  }


  applyFilters(): void {
    console.log('=== Applying Filters ===');
    console.log('Filter Criteria:', this.filterCriteria);
    console.log('Total Appointments:', this.appointments.length);

    this.filteredAppointments = this.appointments.filter(appt => {
      let matches = true;

   
      if (this.filterCriteria.doctorName && this.filterCriteria.doctorName.trim() !== '') {
        const doctorName = (appt.doctorName || '').toLowerCase();
        const searchTerm = this.filterCriteria.doctorName.toLowerCase().trim();
        const nameMatch = doctorName.includes(searchTerm);
        
        console.log(`Doctor Filter - Appt: "${appt.doctorName}", Search: "${this.filterCriteria.doctorName}", Match: ${nameMatch}`);
        matches = matches && nameMatch;
      }

      if (this.filterCriteria.departmentName && this.filterCriteria.departmentName !== '') {
        const deptMatch = appt.departmentName === this.filterCriteria.departmentName;
        
        console.log(`Department Filter - Appt: "${appt.departmentName}", Filter: "${this.filterCriteria.departmentName}", Match: ${deptMatch}`);
        matches = matches && deptMatch;
      }

      if (this.filterCriteria.preferredDate && this.filterCriteria.preferredDate !== '') {
        const apptDate = new Date(appt.preferredDate);
        const filterDate = new Date(this.filterCriteria.preferredDate);
        
     
        const apptDateStr = apptDate.toISOString().split('T')[0];
        const filterDateStr = filterDate.toISOString().split('T')[0];
        
        const dateMatch = apptDateStr === filterDateStr;
        
        console.log(`Date Filter - Appt: "${apptDateStr}", Filter: "${filterDateStr}", Match: ${dateMatch}`);
        matches = matches && dateMatch;
      }

 
      if (this.filterCriteria.status && this.filterCriteria.status !== '') {
        const statusMatch = appt.status === this.filterCriteria.status;
        
        console.log(`Status Filter - Appt: "${appt.status}", Filter: "${this.filterCriteria.status}", Match: ${statusMatch}`);
        matches = matches && statusMatch;
      }

      console.log(`Appointment ${appt.id} final match:`, matches);
      return matches;
    });

    console.log('Filtered Appointments Count:', this.filteredAppointments.length);
    console.log('Filtered Appointments:', this.filteredAppointments);


  }


  clearFilters(): void {
    console.log('Clearing filters');
    
    this.filterCriteria = {
      doctorName: '',
      departmentName: '',
      preferredDate: '',
      status: ''
    };
    
    this.filteredAppointments = [...this.appointments];
    
    console.log('Filters cleared, showing all appointments:', this.filteredAppointments.length);
    

  }

 
  getInitials(name: string | undefined): string {
    if (!name) return 'NA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }


  formatTime(time: string | undefined): string {
    if (!time) return 'N/A';
    
   
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    }
    
    return time;
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
          <p style="margin: 10px 0;"><strong>👨‍⚕️ Doctor:</strong> ${appointment.doctorName || 'N/A'}</p>
          <p style="margin: 10px 0;"><strong>🏥 Department:</strong> ${appointment.departmentName || 'N/A'}</p>
          <p style="margin: 10px 0;"><strong>📅 Date:</strong> ${appointmentDate}</p>
          <p style="margin: 10px 0;"><strong>⏰ Time:</strong> ${appointment.availableTimeSlots || 'N/A'}</p>
          <p style="margin: 10px 0;"><strong>📋 Status:</strong> <span style="color: ${this.getStatusColor(appointment.status)}">${appointment.status || 'Pending'}</span></p>
          ${appointment.reasonforVisit ? `<p style="margin: 10px 0;"><strong>📝 Reason:</strong> ${appointment.reasonforVisit}</p>` : ''}
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      width: '500px'
    });
  }

  getStatusColor(status: string | undefined): string {
    switch(status) {
      case 'Confirmed': return '#28a745';
      case 'Pending': return '#ffc107';
      case 'Cancelled': return '#dc3545';
      case 'Completed': return '#17a2b8';
      default: return '#6c757d';
    }
  }

  addAppointment(): void {
    this.router.navigate(['/add-appointment']);
  }

  updateAppointment(appointmentId: number): void {
    Swal.fire({
      title: '📞 Contact Hospital Staff',
      html: `
        <div style="text-align: center; padding: 20px;">
          <p style="font-size: 1.1rem; margin-bottom: 20px; color: #333;">
            To update your appointment, please contact our hospital staff.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="font-size: 1.3rem; font-weight: bold; color: #667eea; margin: 10px 0;">
              📞 Tel: 0112 235 2354
            </p>
          </div>
          <p style="font-size: 0.9rem; color: #666;">
            Our staff will assist you with rescheduling or modifying your appointment.
          </p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: '✓ Understood',
      confirmButtonColor: '#667eea',
      width: '500px'
    });
  }

  cancelAppointment(appointmentId: number): void {
    Swal.fire({
      title: '❌ Cancel Appointment',
      html: `
        <div style="text-align: center; padding: 20px;">
          <p style="font-size: 1.1rem; margin-bottom: 20px; color: #333;">
            To cancel your appointment, please contact our hospital staff.
          </p>
          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ffc107;">
            <p style="font-size: 1.3rem; font-weight: bold; color: #856404; margin: 10px 0;">
              📞 Tel: 0112 235 2354
            </p>
          </div>
          <p style="font-size: 0.9rem; color: #666; margin-top: 15px;">
            <strong>Note:</strong> Cancellation requests should be made at least 24 hours in advance.
          </p>
        </div>
      `,
      icon: 'warning',
      confirmButtonText: '✓ I Understand',
      confirmButtonColor: '#ffc107',
      width: '550px'
    });
  }

  goTo(page: string): void {
    if (page === 'BacktoDashboard') {
      this.router.navigate(['/patient-dashboard']);
    }
  }
}