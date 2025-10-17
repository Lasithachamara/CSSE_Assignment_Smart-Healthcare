import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var QRCode: any; // global QRCode from CDN

@Component({
  selector: 'app-user-view-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-user-modal.html',
  styleUrls: ['./view-user-modal.css']
})
export class UserViewModalComponent implements OnInit {
  @Input() user: any; // user data passed from parent component
  qrCodeDataUrl: string = '';
  newPassword: string = '';

  ngOnInit(): void {
    if (this.user) this.generateQrCode();
  }

  generateQrCode() {
    const qrValue = `UserID:${this.user.id}, Username:${this.user.userName}`;
    QRCode.toDataURL(qrValue, { width: 200, margin: 2 }, (err: any, url: string) => {
      if (err) console.error(err);
      else this.qrCodeDataUrl = url;
    });
  }

  updatePassword() {
    if (!this.newPassword) {
      alert('Enter a new password.');
      return;
    }
    // Example POST request
    // replace with your UserService call
    console.log('Updating password to:', this.newPassword);
    this.user.password = this.newPassword;
    alert('Password updated successfully!');
    this.newPassword = '';
  }

  closeModal() {
    const modal = document.getElementById('userModal');
    if (modal) modal.style.display = 'none';
  }
}
