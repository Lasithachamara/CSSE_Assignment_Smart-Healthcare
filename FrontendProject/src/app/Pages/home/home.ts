import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [RouterModule,CommonModule], 
})
export class HomeComponent implements OnInit {
  states!: number;

  constructor(private router: Router) {}
  

  ngOnInit(): void {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      this.states = userObj.accessLevel; 
    } catch {
      this.states = 0; 
    }
  } else {
    this.states = 0;
  }
}
  

  goTo(page: string) {
    if (page === 'Customers') {
      this.router.navigate(['/Customers']); 
    } else if (page === 'Item') {
      this.router.navigate(['/Item']);
    }else if (page === 'invoices') {
      this.router.navigate(['/invoices']);
    }else if (page === 'show-users') {
      this.router.navigate(['/show-users']);
    }
  }
}