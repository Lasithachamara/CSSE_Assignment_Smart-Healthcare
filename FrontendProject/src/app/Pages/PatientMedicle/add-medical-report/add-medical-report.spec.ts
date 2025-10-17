import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMedicalReport } from './add-medical-report';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MedicalReportService } from '../../../services/medical-report.service';

describe('AddMedicalReport', () => {
  let component: AddMedicalReport;
  let fixture: ComponentFixture<AddMedicalReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddMedicalReport,
        ReactiveFormsModule,
        CommonModule,
        HttpClientTestingModule 
      ],
      providers: [MedicalReportService] 
    }).compileComponents();

    fixture = TestBed.createComponent(AddMedicalReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
