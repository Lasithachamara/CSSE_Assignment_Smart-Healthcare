import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMedicalHistoryComponent } from './add-medical-history';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MedicalHistoryService } from '../../../services/medical-history.service';

describe('AddMedicalHistoryComponent', () => {
  let component: AddMedicalHistoryComponent;
  let fixture: ComponentFixture<AddMedicalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddMedicalHistoryComponent,
        ReactiveFormsModule,
        CommonModule,
        HttpClientTestingModule  
      ],
      providers: [MedicalHistoryService] 
    }).compileComponents();

    fixture = TestBed.createComponent(AddMedicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
