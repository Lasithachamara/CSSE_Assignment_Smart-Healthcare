import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowUsers } from './show-users';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddUserService } from '../../../services/add-user.service';

describe('ShowUsers', () => {
  let component: ShowUsers;
  let fixture: ComponentFixture<ShowUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ShowUsers,
        CommonModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [AddUserService]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
