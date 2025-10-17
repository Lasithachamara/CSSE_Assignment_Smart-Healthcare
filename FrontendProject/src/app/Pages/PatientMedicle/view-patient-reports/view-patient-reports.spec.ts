import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewPatientReports } from './view-patient-reports';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MedicalReportService } from '../../../services/medical-report.service';

describe('ViewPatientReports', () => {
  let component: ViewPatientReports;
  let fixture: ComponentFixture<ViewPatientReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ViewPatientReports,
        CommonModule,
        HttpClientTestingModule 
      ],
      providers: [MedicalReportService]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPatientReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
