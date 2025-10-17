import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewModalComponent } from './view-user-modal';

describe('ViewUserModal', () => {
  let component: UserViewModalComponent;
  let fixture: ComponentFixture<UserViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserViewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
