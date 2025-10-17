import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';   
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../Models/customer.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterModule],  
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  goToDashboard() {
  this.router.navigate(['']);
  } 

  ngOnInit(): void {
    this.loadCustomers();
  }

  
  addCustomer(): void {
    this.router.navigate(['/Customers/add']);
  }

  
  editCustomer(id?: number): void {
    if (id == null) {
      console.warn('editCustomer called without id');
      return;
    }
    this.router.navigate(['/Customers/edit', id]);
  }

  
  deleteCustomer(id?: number): void {
  if (id == null) {
    console.warn('deleteCustomer called without id');
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "Do you really want to delete this customer?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#4CAF50',
    confirmButtonText: 'Yes, delete!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The customer has been deleted successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadCustomers();
        },
        error: (err) => {
          console.error('Delete failed', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the customer. Please try again.',
          });
        }
      });
    }
  });
}


  /* Load all customers */
  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading customers', err);
        this.loading = false;
      }
    });
  }
}