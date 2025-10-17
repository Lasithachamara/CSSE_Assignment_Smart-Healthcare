import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalReport } from './add-medical-report';

describe('AddMedicalReport', () => {
  let component: AddMedicalReport;
  let fixture: ComponentFixture<AddMedicalReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicalReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicalReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
