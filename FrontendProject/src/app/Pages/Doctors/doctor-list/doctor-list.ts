import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService, Doctor } from '../../../services/doctor.service';
import { InvoiceService } from '../../../services/Invoice.service';
import { InvoiceHeader, InvoiceDetail } from '../../../Models/InvoiceWithDetailsDTO';


@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-list.html',
  styleUrls: ['./doctor-list.css']
})
export class DoctorComponent implements OnInit {
  doctors: Doctor[] = [];
  user: any;
  loading = true;
  error = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getAll().subscribe({
      next: (data) => {
        this.doctors = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
        this.error = 'Unable to load doctor list.';
        this.loading = false;
      }
    });
  }

  bookAppointment(doctorId: number): void {
    // You can later navigate to appointment booking page
    alert(`Booking appointment with Doctor ID: ${doctorId}`);
  }
}
