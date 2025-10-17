import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserWiseDetails } from './user-wise-details';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddUserService } from '../../../services/add-user.service';

describe('UserWiseDetails', () => {
  let component: UserWiseDetails;
  let fixture: ComponentFixture<UserWiseDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserWiseDetails,
        CommonModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [AddUserService]
    }).compileComponents();

    fixture = TestBed.createComponent(UserWiseDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
