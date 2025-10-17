import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalHistoryComponent } from './add-medical-history';

describe('AddMedicalHistory', () => {
  let component: AddMedicalHistoryComponent;
  let fixture: ComponentFixture<AddMedicalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicalHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
