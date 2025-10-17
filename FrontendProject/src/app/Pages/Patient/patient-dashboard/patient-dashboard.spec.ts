import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientDashboard } from './patient-dashboard';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PatientDashboard', () => {
  let component: PatientDashboard;
  let fixture: ComponentFixture<PatientDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDashboard, HttpClientTestingModule], 
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ userId: 1 }) }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
