import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MedicalReportService, MedicalReport } from '../../../services/medical-report.service';

@Component({
  selector: 'app-patient-reports',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-reports.html',
  styleUrls: ['./patient-reports.css']
})
export class PatientReports implements OnInit {
  user: any;
  medicalReports: MedicalReport[] = [];

  constructor(private medicalReportService: MedicalReportService,private router: Router) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loadReports();
  }

  loadReports(): void {
    if (!this.user?.id) return;

    this.medicalReportService.getReportsByPatient(this.user.id).subscribe({
      next: (res) => this.medicalReports = res,
      error: (err) => console.error('Failed to load reports:', err)
    });
  }

viewReport(report: MedicalReport): void {
  if (!report.fileData) return;

  const blob = this.base64ToBlob(report.fileData, 'application/pdf');
  const url = window.URL.createObjectURL(blob);
  window.open(url, '_blank');
}

downloadReport(report: MedicalReport): void {
  if (!report.fileData) return;

  const blob = this.base64ToBlob(report.fileData, 'application/pdf');
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = report.reportName || 'report.pdf';
  a.click();
  window.URL.revokeObjectURL(url);
}

base64ToBlob(base64: string, type: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type });
}


  addReport(): void {
    console.log('Navigate to add report page');
  }

  goTo(page: string): void {
    if (page === 'BacktoDashboard') {
      this.router.navigate(['/patient-dashboard']); 
    } 
  }
}