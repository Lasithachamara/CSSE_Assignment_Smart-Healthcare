import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalHistoryComponent } from './medical-history';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MedicalHistoryService } from '../../../services/medical-history.service';

describe('MedicalHistoryComponent', () => {
  let component: MedicalHistoryComponent;
  let fixture: ComponentFixture<MedicalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MedicalHistoryComponent,
        CommonModule,
        HttpClientTestingModule  
      ],
      providers: [MedicalHistoryService] 
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
