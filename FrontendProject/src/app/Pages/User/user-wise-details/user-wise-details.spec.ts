import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseDetails } from './user-wise-details';

describe('UserWiseDetails', () => {
  let component: UserWiseDetails;
  let fixture: ComponentFixture<UserWiseDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWiseDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWiseDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
