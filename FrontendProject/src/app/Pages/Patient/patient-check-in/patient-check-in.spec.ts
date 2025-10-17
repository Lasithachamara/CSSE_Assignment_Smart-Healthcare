import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCheckIn } from './patient-check-in';

describe('PatientCheckIn', () => {
  let component: PatientCheckIn;
  let fixture: ComponentFixture<PatientCheckIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCheckIn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCheckIn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
