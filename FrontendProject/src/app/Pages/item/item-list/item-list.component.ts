import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../Models/item.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'], 
  standalone:true,
  imports: [CommonModule], 
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  loading = false;

  constructor(
    private itemService: ItemService,
    private router: Router) {}

  goToDashboard() {
  this.router.navigate(['']);
  } 

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() :void {
    this.loading=true;
    this.itemService.getItems().subscribe({
      next: (data:Item[])=> {
        this.items = data;
        this.loading = false;
      },
      error: (err:any)=> {
        console.error('Error loading items',err);
        this.loading = false;
      }
    });
  }

  onAddItem(): void {
    this.createItem();
  }

  editItem(id?: number): void {
  if (id == null) {
    console.warn('editItem called without id');
    return;
  }
  this.router.navigate(['Item/edit', id]);
  }


  deactivateItem(id: number) {
  if (id == null) {
    console.warn('deactivateItem called without id');
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "Do you really want to deactivate this item?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#4CAF50',
    confirmButtonText: 'Yes, deactivate it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.itemService.deactivateItem(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Deactivated!',
            text: 'The item has been deactivated successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadItems();
        },
        error: (err) => {
          console.error('Deactivation failed', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to deactivate the item. Please try again.',
          });
        }
      });
    }
  });
}

  createItem(): void {
    this.router.navigate(['/Item/add']); 
    
  }
}