import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../services/Invoice.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
//import { InvoiceHeader } from '../../../Models/InvoiceHeader.model';
//import { InvoiceDetail } from '../../../Models/invoicedetails.model';
import { InvoiceWithDetailsDTO } from '../../../Models/InvoiceWithDetailsDTO';
import { InvoiceHeader, InvoiceDetail } from '../../../Models/InvoiceWithDetailsDTO';

@Component({
  selector: 'app-add-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-invoice.html',
  styleUrls: ['./add-invoice.css'] 
})
export class AddInvoice implements OnInit {
  Items: any[] = [];

  selectedItem = {
    id: '',
    name: '',
    price: '',
    quantity: ''
  };

  sellingItem = {
    qty: '',
    price: '',
    discount: ''
  };

  addedItems: any[] = [];
  editIndex: number | null = null;

  constructor(
    private InvoiceService: InvoiceService,
    private router: Router
  ) {}
  customers: any[] = [];
  selectedCustomerId: string = '';
  selectedCustomer: any = null;
  invoiceNumber: string = '';
  isLoading = false;

  ngOnInit(): void {
    this.InvoiceService.getItems().subscribe({
      next: (data) => {
        this.Items = data;
      },
      error: (err) => {
        console.error('Error fetching Items:', err);
      }
    });
    this.InvoiceService.getCustomers().subscribe({
    next: (data) => {
      this.customers = data;
    },
    error: (err) => {
      console.error('Error fetching customers:', err);
    }
    });
    this.loadInvoiceNumber();
  }

  loadInvoiceNumber(): void {
    this.InvoiceService.getLastInvoiceNo().subscribe(lastNo => {
      this.invoiceNumber = `INV-${(lastNo + 1).toString().padStart(5, '0')}`;
    });
  }

 
  onCustomerChange() {
    this.selectedCustomer = this.customers.find(c => c.id === this.selectedCustomerId);
  }


  selectItem(item: any) {
    this.selectedItem = { ...item };
    this.sellingItem = {
      qty: '',
      price: '',
      discount: ''
    };
    this.editIndex = null;
  }

  saveItem() {
    const qty = Number(this.sellingItem.qty);
    const price = Number(this.sellingItem.price);
    const discount = Number(this.sellingItem.discount);

    if (!this.selectedItem.id || isNaN(qty) || isNaN(price) || isNaN(discount)) {
      Swal.fire('warning', 'Please select an item and enter valid numeric Qty, Price and  Discount.', 'warning');
      return;
    }

    if (!this.selectedItem.id || !this.sellingItem.qty || !this.sellingItem.price) {
      Swal.fire('warning', 'Please select an item and enter details.', 'warning');
      return;
    }
    if (+this.sellingItem.price < +this.sellingItem.discount || +this.sellingItem.discount < 0) {
      Swal.fire('warning', 'Selling price cannot be higher than original price.', 'warning');
      return;
    }

    if (+this.sellingItem.qty > +this.selectedItem.quantity || +this.sellingItem.qty < 0 ) {
      Swal.fire('warning', 'Selling quantity exceeds available quantity.', 'warning');
      return;
    } 
    if (+this.sellingItem.price < +this.selectedItem.price) {
      Swal.fire('warning', 'Selling price cannot be higher than original price.', 'warning');
      return;
    }

    const newItem = {
      id: this.selectedItem.id,
      name: this.selectedItem.name,
      availableQty: this.selectedItem.quantity,
      originalPrice: this.selectedItem.price,
      sellingQty: this.sellingItem.qty,
      sellingPrice: this.sellingItem.price,
      discount: this.sellingItem.discount
    };

    if (this.editIndex !== null) {
      this.addedItems[this.editIndex] = newItem;
      this.editIndex = null;
      Swal.fire('Updated', 'Item has been updated.', 'success');
    } else {
      const isAlreadyAdded = this.addedItems.some(item => item.id === this.selectedItem.id);
      if (isAlreadyAdded) {
        Swal.fire('Duplicate', 'Item already added.', 'warning');
        return;
      }

      this.addedItems.push(newItem);
      Swal.fire('Added', 'Item added to invoice.', 'success');
    }
    
    this.sellingItem = {
      qty: '',
      price: '',
      discount: ''
    },
    this.selectedItem = {
    id: '',
    name: '',
    price: '',
    quantity: ''
  };
  }

  deleteItem(index: number) {
    this.addedItems.splice(index, 1);
    Swal.fire('Deleted', 'Item has been removed.', 'success');
  }

  editItem(index: number) {
    const item = this.addedItems[index];

    this.selectedItem = {
      id: item.id,
      name: item.name,
      price: item.originalPrice,
      quantity: item.availableQty
    };

    this.sellingItem = {
      qty: item.sellingQty,
      price: item.sellingPrice,
      discount: item.discount
    };

    this.editIndex = index;
  }

  getTotalQty(): number {
  return this.addedItems.reduce((total, item) => total + +item.sellingQty, 0);
}

getTotalAmount(): number {
  return this.addedItems.reduce((total, item) => {
    const qty = +item.sellingQty;
    const price = +item.sellingPrice;
    const discount = +item.discount || 0;
    return total + ((qty * price) - (qty * discount));
  }, 0);
}

finalizeInvoice() {
  if (!this.selectedCustomerId || this.addedItems.length === 0) {
    Swal.fire('warning', 'Please select a customer and add at least one item.', 'warning');
    return;
  }

  this.isLoading = true;

  const savedUserJson = localStorage.getItem('currentUser');
  let name = 'Unknown';

  if (savedUserJson) {
    try {
      const user = JSON.parse(savedUserJson);
      name = user.name || 'Unknown';
    } catch {
      name = 'Unknown';
    }
  }

  const invoiceHeaderDTO: InvoiceHeader = {
    invoiceNo: this.invoiceNumber,
    invoiceId: this.invoiceNumber || '', 
    customerId: +this.selectedCustomerId,
    invoiceDate: new Date().toISOString(),
    totalAmount: this.getTotalAmount(),
    totalQty: this.getTotalQty(),
    isActive: true,
    createdBy: name, 
    userName: name,  
    createdDate: new Date().toISOString(),
    cusName: this.selectedCustomer?.cusName || '',
  };

  const invoiceDetails: InvoiceDetail[] = this.addedItems.map(item => ({
    invoiceId: this.invoiceNumber || '', 
    itemId: item.id,
    itemQty: +item.sellingQty,
    price: +item.sellingPrice,
    rQty: 0,
    discount: +item.discount || 0,
    itemName: item.itemName, 
    createdBy: name, 
    userName: name,  
    createdDate: new Date().toISOString(),
    totalAmount: (+item.sellingQty * +item.sellingPrice) - (+item.sellingQty * +item.discount),
  }));

  const invoiceWithDetailsDTO: InvoiceWithDetailsDTO = {
    header: invoiceHeaderDTO,
    details: invoiceDetails
  };

  this.InvoiceService.createInvoiceWithDetails(invoiceWithDetailsDTO).subscribe({
    next: (res: any) => {
      this.isLoading = false;

      if (res && res.success) {
        Swal.fire('Success', 'Invoice and details saved successfully!', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire('Error', res.message || 'Error saving invoice.', 'error');
      }
    },
    error: (err) => {
      this.isLoading = false;
      Swal.fire('Error', 'Error saving invoice. Rolled back.', 'error');
    }
  });
}


resetForm() {
  this.addedItems = [];
  this.selectedCustomerId = '';
  this.loadInvoiceNumber();
  
}
}
