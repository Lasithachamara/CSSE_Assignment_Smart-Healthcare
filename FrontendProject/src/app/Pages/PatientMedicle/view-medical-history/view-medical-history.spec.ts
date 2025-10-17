import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMedicalHistory } from './view-medical-history';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MedicalHistoryService } from '../../../services/medical-history.service';

describe('ViewMedicalHistory', () => {
  let component: ViewMedicalHistory;
  let fixture: ComponentFixture<ViewMedicalHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ViewMedicalHistory,
        CommonModule,
        HttpClientTestingModule 
      ],
      providers: [MedicalHistoryService] 
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMedicalHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
