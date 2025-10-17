import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalHistoryService, MedicalHistory } from '../../../services/medical-history.service';

@Component({
  selector: 'app-add-medical-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-medical-history.html',
  styleUrls: ['./add-medical-history.css']
})
export class AddMedicalHistoryComponent {
  medicalHistory: Partial<MedicalHistory> = {
    title: '',
    description: '',
    prescription: '',
  };

  user: any;         
  selectedUserId: number | null = null; 
  loading = false;
  message = '';
  error = '';

  constructor(private medicalHistoryService: MedicalHistoryService) {}

  ngOnInit(): void {
    
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (this.user?.accessLevel === 3) {
      const storedUserId = localStorage.getItem('selectedUserId');
      this.selectedUserId = storedUserId ? parseInt(storedUserId, 10) : null;
    }
  }

  submitForm(): void {
    if (!this.medicalHistory.title || !this.medicalHistory.description) {
      this.error = 'Title and Description are required.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const userIdToUse = this.user?.accessLevel === 3
      ? this.selectedUserId || 0
      : this.user?.id || 0;

    const newRecord: MedicalHistory = {
      id: 0,
      userId: userIdToUse,
      title: this.medicalHistory.title!,
      description: this.medicalHistory.description!,
      prescription: this.medicalHistory.prescription || '',
      createdBy: this.user?.username || 'System',
      createdDate: new Date().toISOString()
    };

    this.medicalHistoryService.create(newRecord).subscribe({
      next: (res) => {
        this.message = 'Medical history added successfully!';
        this.loading = false;
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding record:', err);
        this.error = 'Failed to add medical history. Please try again.';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.medicalHistory = {
      title: '',
      description: '',
      prescription: ''
    };
  }
}
