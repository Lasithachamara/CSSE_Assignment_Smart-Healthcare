import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/show-users.service';
import { User } from '../../../Models/user.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-show-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './show-users.html',
  styleUrls: ['./show-users.css'] 
})
export class ShowUsers implements AfterViewInit {
  @ViewChild('barcodeCanvas') barcodeCanvas!: ElementRef<HTMLCanvasElement>;
  
  users: User[] = [];
  selectedUserId: number | null = null;
  message = '';
  
  showModal = false;
  selectedUser: User | null = null;
  newPassword = '';
  confirmPassword = '';
  passwordMessage = '';
  passwordSuccess = false;

  constructor(private router: Router, private userService: UserService) {
    this.loadUsers();
  }

  ngAfterViewInit() {
    
  }

  goToAddUser() {
    this.router.navigate(['/RegisterUser']);
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data.filter(user => user.activeStatus === true);
        console.log('Users loaded:', this.users);
      },
      error: () => (this.message = 'Failed to load users.')
    });
  }

  selectRow(userId: number) {
    this.selectedUserId = this.selectedUserId === userId ? null : userId;
  }

  getAccessLevelName(level: number): string {
    switch(level) {
      case 1: return 'Patient';
      case 2: return 'Staff';
      case 3: return 'Doctor';
      default: return 'Unknown';
    }
  }

  openUserModal(user: User) {
    this.selectedUser = user;
    this.showModal = true;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordMessage = '';
    this.passwordSuccess = false;
    
    setTimeout(() => {
      this.generateBarcode(user.id.toString());
    }, 100);
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordMessage = '';
    this.passwordSuccess = false;
  }

  generateBarcode(text: string) {
    if (!this.barcodeCanvas) return;
    
    const canvas = this.barcodeCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 100;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barcodeData = this.textToBarcode(text);
    const barWidth = 3;
    const startX = 20;
    const startY = 10;
    const barHeight = 60;

    ctx.fillStyle = '#000000';
    
    let x = startX;
    for (let i = 0; i < barcodeData.length; i++) {
      if (barcodeData[i] === '1') {
        ctx.fillRect(x, startY, barWidth, barHeight);
      }
      x += barWidth;
    }

    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, startY + barHeight + 20);
  }

  textToBarcode(text: string): string {
    let barcode = '101';
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const pattern = (charCode % 2 === 0) ? '110010' : '100110';
      barcode += pattern;
    }
    
    barcode += '101'; 
    return barcode;
  }

  updatePassword() {
    this.passwordMessage = '';
    this.passwordSuccess = false;

    if (!this.newPassword || !this.confirmPassword) {
      this.passwordMessage = 'Please fill in both password fields.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordMessage = 'Passwords do not match.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordMessage = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.selectedUser) {
      this.userService.updateUserPassword(this.selectedUser.id, this.newPassword).subscribe({
        next: () => {
          this.passwordMessage = 'Password updated successfully!';
          this.passwordSuccess = true;
          this.newPassword = '';
          this.confirmPassword = '';
          setTimeout(() => {
            this.closeModal();
          }, 2000);
        },
        error: () => {
          this.passwordMessage = 'Failed to update password.';
          this.passwordSuccess = false;
        }
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.message = 'User deleted successfully.';
          this.selectedUserId = null;
          this.loadUsers();
          console.log('Deleted user:', id);
        },
        error: () => (this.message = 'Failed to delete user.')
      });
    }
  }
}