import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../services/Invoice.service';
import { Invoice } from '../../../Models/invoice.model';
import { Item } from '../../../Models/item.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './invoice-list.html',
  styleUrls: ['./invoice-list.css']
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  showActive: boolean = true;

  selectedInvoice: Invoice | null = null;
  invoiceItems: Item[] = [];

  isLoading: boolean = false;

  searchTerm: string = '';  

  constructor(
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.isLoading = true;
    this.invoiceService.getInvoices().subscribe({
      next: (data: Invoice[]) => {
        this.invoices = data || [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching invoices:', err);
        this.invoices = [];
        this.filteredInvoices = [];
        this.isLoading = false;
      }
    });
  }

  toggleFilter(showActive: boolean): void {
    this.showActive = showActive;
    this.applyFilter();
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredInvoices = this.invoices
      .filter(i => (this.showActive ? i.isActive : !i.isActive))
      .filter(i =>
        i.invoiceNo.toLowerCase().includes(term) ||
        i.cusName.toLowerCase().includes(term)
      );
  }

  goToADDInvoices(): void {
    this.router.navigate(['/addinvoices']);
  }

  selectInvoice(inv: Invoice): void {
    this.selectedInvoice = inv;

    if (inv.items && inv.items.length > 0) {
      this.invoiceItems = inv.items;
    } else {
      this.invoiceItems = [];
      this.invoiceService.getInvoiceItems(inv.invoiceNo).subscribe({
        next: (items: Item[]) => this.invoiceItems = items,
        error: () => this.invoiceItems = []
      });
    }
  }

  closeModal(): void {
    this.selectedInvoice = null;
    this.invoiceItems = [];
  }

  deleteInvoices(): void {
    const invoiceNo = this.selectedInvoice?.invoiceNo;
    if (!invoiceNo) return;

    Swal.fire({
      title: `Delete invoice ${invoiceNo}?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.invoiceService.deleteInvoice(invoiceNo).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Invoice deleted successfully.'
            });
            this.closeModal();
            this.loadInvoices();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete invoice.'
            });
            console.error('Error deleting invoice:', err);
          }
        });
      }
    });
  }
}
