import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../Models/item.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-add-edit',
  templateUrl: './item-add-edit.component.html',
  styleUrls: ['./item-add-edit.component.css'], 
  standalone: true, 
  imports: [CommonModule, FormsModule],
})
export class ItemAddEditComponent implements OnInit {
  @Input() editingItem: Item | null = null;

  isEditMode = false;

  model: Item = {
    id: 0,
    itemName: '',
    price: null as any,
    quantity: null as any,
    reorderLv: null as any,
    isActive: true,
    createdBy: '',
    createdDate: new Date(),
    name: '',
  };

  constructor(private route: ActivatedRoute, private itemService: ItemService, private router :Router) {}

  goToDashboard() {
  this.router.navigate(['']);
  } 

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.isEditMode = true;
    this.itemService.getItem(+id).subscribe(item => {
      this.model = item;
    });
    } else {
    this.isEditMode = false;
    }
    
  }

  onSubmit(form: NgForm) {
  if (!form.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill out all required fields correctly before submitting.',
        confirmButtonColor: '#f6a500'
      });
      return;
    }

  
    const savedUserJson = localStorage.getItem('currentUser');
    let createdBy = 'Unknown';

  if (savedUserJson) {
    try {
      const user = JSON.parse(savedUserJson);
      createdBy = user.name || 'Unknown';
    } catch {
      createdBy = 'Unknown';
    }
  }

  this.model.createdBy = createdBy;
   console.log("item",this.model);
    if (this.isEditMode) {
  this.itemService.updateItem(this.model).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Item Updated',
        text: `${this.model.name} has been updated successfully.`,
        confirmButtonColor: '#4CAF50'
      }).then(() => {
        this.router.navigate(['/Item']);
        this.resetForm(form);
      });
    },
    error: (err) => {
      console.error('Failed to update item:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Something went wrong while updating the item. Please try again.',
        confirmButtonColor: '#d33'
      });
    }
  });
} else {
  this.itemService.createItem(this.model).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Item Added',
        text: `${this.model.name} has been added successfully.`,
        confirmButtonColor: '#4CAF50'
      }).then(() => {
        this.router.navigate(['/Item']);
        this.resetForm(form);
      });
    },
    error: (err) => {
      console.error('Failed to add item:', err);
      Swal.fire({
        icon: 'error',
        title: 'Addition Failed',
        text: 'Something went wrong while adding the item. Please try again.',
        confirmButtonColor: '#d33'
      });
    }
  });
}

  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.isEditMode = false;
    this.model = {
      id: 0,
      itemName: '',
      name: '',
      price: null as any,
      quantity: null as any,
      reorderLv: null as any,
      isActive: true,
      createdBy: '',
      createdDate: new Date()
    };
  }

}