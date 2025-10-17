import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MedicalReportService } from '../../../services/medical-report.service';

@Component({
  selector: 'app-add-medical-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-medical-report.html',
  styleUrls: ['./add-medical-report.css']
})
export class AddMedicalReport implements OnInit {
  patientId: number | null = null;      // Automatically set
  selectedFile: File | null = null;
  message: string = '';
  isLoading: boolean = false;
  userAccessLevel: number = 0;

  constructor(private medicalReportService: MedicalReportService, private router: Router) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      this.userAccessLevel = userObj.accessLevel;

      if (this.userAccessLevel === 2) {
        // Normal user: use their own ID
        this.patientId = userObj.id;
      } else if (this.userAccessLevel === 3) {
        // Doctor: use selectedUserId from localStorage
        const selectedIdStr = localStorage.getItem('selectedUserId');
        this.patientId = selectedIdStr ? parseInt(selectedIdStr, 10) : null;
      }
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('Selected file:', this.selectedFile);
    } else {
      this.selectedFile = null;
    }
  }

  uploadReport(): void {
    if (!this.patientId) {
      this.message = 'Patient ID is missing.';
      return;
    }

    if (!this.selectedFile) {
      this.message = 'Please select a file.';
      return;
    }

    this.isLoading = true;
    this.message = '';

    // Append patientId to the file name
    const fileNameWithUserId = `${this.patientId}_${this.selectedFile.name}`;
    const fileWithUserId = new File([this.selectedFile], fileNameWithUserId, { type: this.selectedFile.type });

    this.medicalReportService.uploadReport(this.patientId, fileWithUserId)
      .subscribe({
        next: (res) => {
          this.message = '✅ ' + res.message;
          this.isLoading = false;

          // Reset file
          this.selectedFile = null;

          // Navigate depending on access level
          if (this.userAccessLevel === 2) {
            this.router.navigate(['/user-wise-details']);
          } else if (this.userAccessLevel === 3) {
            // Doctor can stay on the same page or navigate as needed
            this.router.navigate(['/Home']);
          }
        },
        error: (err) => {
          this.message = '❌ Upload failed. ' + (err.error || '');
          this.isLoading = false;
        }
      });
  }
}
