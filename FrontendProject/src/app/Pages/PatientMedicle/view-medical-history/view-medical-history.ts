import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MedicalHistoryService, MedicalHistory } from '../../../services/medical-history.service';

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-medical-history.html',
  styleUrls: ['./view-medical-history.css']
})
export class ViewMedicalHistory implements OnInit {
  histories: MedicalHistory[] = [];
  userId = 0;
  loading = true;
  error = '';
  user: any;

 
  selectedRecord: MedicalHistory | null = null;

  constructor(private historyService: MedicalHistoryService , private router: Router) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (this.user?.accessLevel === 3) {
      const storedUserId = localStorage.getItem('selectedUserId');
      this.userId = storedUserId ? parseInt(storedUserId, 10) : 0;
    } else {
      this.userId = this.user?.id || 0;
    }

    this.loadMedicalHistory();
  }

  loadMedicalHistory(): void {
    this.loading = true;
    this.error = '';

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

  goTo(page: string): void {
    if (page === 'BacktoDashboard') {
      this.router.navigate(['/Home']); 
    } 
  }
}
