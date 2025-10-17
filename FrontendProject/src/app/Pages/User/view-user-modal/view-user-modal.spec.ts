import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserViewModalComponent } from './view-user-modal';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserViewModalComponent', () => {
  let component: UserViewModalComponent;
  let fixture: ComponentFixture<UserViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserViewModalComponent,
        CommonModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
