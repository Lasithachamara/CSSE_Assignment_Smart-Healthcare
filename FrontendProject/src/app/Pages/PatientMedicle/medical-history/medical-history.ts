import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalHistoryService, MedicalHistory } from '../../../services/medical-history.service';

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medical-history.html',
  styleUrls: ['./medical-history.css']
})
export class MedicalHistoryComponent implements OnInit {
  histories: MedicalHistory[] = [];
  userId = 0;
  loading = true;
  error = '';
  user: any;

  selectedRecord: MedicalHistory | null = null;

  constructor(private historyService: MedicalHistoryService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userId = this.user?.id || 0;

    this.loadMedicalHistory();
  }

  loadMedicalHistory(): void {
    this.historyService.getByUserId(this.userId).subscribe({
      next: (data) => {
        this.histories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading medical history:', err);
        this.error = 'Unable to load medical history.';
        this.loading = false;
      }
    });
  }
  openDetails(record: MedicalHistory): void {
    this.selectedRecord = record;
  }

  closeDetails(): void {
    this.selectedRecord = null;
  }
}
