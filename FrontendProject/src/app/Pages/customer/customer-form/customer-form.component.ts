import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../Models/customer.model';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,  // For *ngIf
    FormsModule    // For ngModel & ngForm
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  customer: Customer = { nic: '', name: '', mobileNo: 0, createdBy: '' };
  isEditMode = false;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.customerService.getCustomerById(+id).subscribe({
        next: (data) => this.customer = data,
        error: (err) => console.error(err)
      });
    }
  }

  goToDashboard() {
    this.router.navigate(['']);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please fill out all required fields correctly before submitting.',
        confirmButtonColor: '#f6a500'
      });
      return;
    }

    this.customer.mobileNo = Number(this.customer.mobileNo);

    const savedUserJson = localStorage.getItem('currentUser');
    this.customer.createdBy = 'Unknown';
    if (savedUserJson) {
      try {
        const user = JSON.parse(savedUserJson);
        this.customer.createdBy = user.name || 'Unknown';
      } catch {}
    }

    if (this.isEditMode) {
      this.customerService.updateCustomer(this.customer).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Customer Updated',
            text: `${this.customer.name} has been updated successfully.`,
            confirmButtonColor: '#4CAF50'
          }).then(() => this.router.navigate(['/Customers']));
        },
        error: (err) => {
          console.error('Failed to update customer', err);
          if (err.status === 409) {
            Swal.fire({ icon: 'error', title: 'NIC Conflict', text: err.error.message });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: 'Please Re-check the Entered Data',
              confirmButtonColor: '#d33'
            });
          }
        }
      });
    } else {
      this.customerService.createCustomer(this.customer).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Customer Added',
            text: `${this.customer.name} has been added successfully.`,
            confirmButtonColor: '#4CAF50'
          }).then(() => this.router.navigate(['/Customers']));
        },
        error: (err) => {
          console.error('Failed to add customer', err);
          if (err.status === 409) {
            Swal.fire({ icon: 'error', title: 'NIC Conflict', text: err.error.message });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Addition Failed',
              text: 'Please Re-check the Entered Data',
              confirmButtonColor: '#d33'
            });
          }
        }
      });
    }
  }
}