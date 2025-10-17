
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { User } from '../../../Models/user.model';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  providers: [LoginService],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';
  message = '';
  
  constructor(private authService: LoginService, private router: Router) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: User) => {
        console.log('Backend response:', response);
        this.message = 'Login successful!';

        localStorage.setItem('currentUser', JSON.stringify(response));
        this.authService.currentUser = response;

        const accessLevel = response.accessLevel || 0;
        console.log('Navigating based on accessLevel:', accessLevel);

        if (accessLevel === 2) {
          console.log('Navigating :', accessLevel);
          this.router.navigate(['/patient-dashboard']);
        } else {
          console.log('Home :', accessLevel);
          this.router.navigate(['/Home']);
        }
      },
      error: (err) => {
        this.message = 'Login failed!';
        console.error('Login error:', err);
      }
    });
  }
}
