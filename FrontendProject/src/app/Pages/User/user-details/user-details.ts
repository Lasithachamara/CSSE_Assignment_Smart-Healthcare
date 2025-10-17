import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../Models/user.model';
import { UserDetailService } from '../../../services/user-details.service';
import { AddUserService } from '../../../services/add-user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.css']
})
export class UserDetails implements OnInit {
  userId!: number;
  user!: User;
  userLevels: any[] = [];
  isEditing = false;
  form!: FormGroup;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private userDetailService: UserDetailService,
    private addUserService: AddUserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadUserLevels();
    this.loadUser();
  }

  initForm() {
    this.form = this.fb.group({
      userName: [{ value: '', disabled: true }, Validators.required],
      nic: [{ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(/^([0-9]{9}[vVxX]|[0-9]{12})$/) // Sri Lankan NIC
      ]],
      name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [
        Validators.required,
        Validators.email
      ]],
      mobile: [{ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(/^07[0-9]{8}$/) // Sri Lankan mobile number
      ]],
      accessLevel: [{ value: '', disabled: true }, Validators.required],
      activeStatus: [{ value: false, disabled: true }],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    });
  }

  loadUserLevels() {
    this.addUserService.getUserlevel().subscribe({
      next: levels => this.userLevels = levels,
      error: () => this.message = 'Failed to load user levels.'
    });
  }

  loadUser() {
    this.userDetailService.getUserById(this.userId).subscribe({
      next: (user: User) => {
        this.user = user;
        this.patchForm(user);
      },
      error: () => this.message = 'Failed to load user details.'
    });
  }

  patchForm(user: User) {
    this.form.patchValue({
      userName: user.userName,
      nic: user.nic,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      accessLevel: user.accessLevel,
      activeStatus: user.activeStatus
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    const editableFields = ['nic', 'name', 'email', 'mobile', 'accessLevel', 'activeStatus'];

    if (this.isEditing) {
      editableFields.forEach(field => this.form.get(field)?.enable());
    } else {
      editableFields.forEach(field => this.form.get(field)?.disable());
      this.patchForm(this.user);
      this.message = '';
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.message = 'Please fill all required fields correctly.';
      return;
    }

    const { newPassword, confirmPassword, nic, name, email, mobile, userName ,accessLevel, activeStatus } = this.form.value;

    if ((newPassword || confirmPassword) && newPassword !== confirmPassword) {
      this.message = 'New password and confirm password do not match.';
      return;
    }

    // Get current user from localStorage
    const savedUserJson = localStorage.getItem('currentUser');
    let createByName = 'Unknown';
    if (savedUserJson) {
      try {
        const currentUser = JSON.parse(savedUserJson);
        createByName = currentUser.name || 'Unknown';
      } catch {}
    }

    const updatePayload: any = {
      id: this.userId,
      nic,
      UserName:'admin',
      name,
      email,
      mobile,
      accessLevel,
      activeStatus,
      createdBy: createByName,
      createdDate: new Date().toISOString()
    };

    if (newPassword) updatePayload.password = newPassword;

    this.userDetailService.updateUser(updatePayload).subscribe({
      next: () => {
        this.message = 'User updated successfully.';
        this.isEditing = false;
        this.toggleEdit(); 
        this.loadUser();
        this.router.navigate(['/show-users']);
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error updating user. Please try again.';
      }
    });
  }
}
