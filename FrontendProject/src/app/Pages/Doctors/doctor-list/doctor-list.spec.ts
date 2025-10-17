import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorComponent } from './doctor-list';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DoctorService } from '../../../services/doctor.service'; // adjust path if needed

describe('DoctorComponent', () => {
  let component: DoctorComponent;
  let fixture: ComponentFixture<DoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DoctorComponent,       
        HttpClientTestingModule 
      ],
      providers: [
        DoctorService        
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
