import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientReports } from './patient-reports';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MedicalReportService } from '../../../services/medical-report.service';

describe('PatientReports', () => {
  let component: PatientReports;
  let fixture: ComponentFixture<PatientReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PatientReports,
        CommonModule,
        HttpClientTestingModule 
      ],
      providers: [MedicalReportService] 
    }).compileComponents();

    fixture = TestBed.createComponent(PatientReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
