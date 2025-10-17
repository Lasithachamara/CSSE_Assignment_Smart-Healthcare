import { Item } from '../Models/item.model';

export interface Invoice {
  invoiceNo: string;
  customerId: number;
  invoiceDate: string;
  totalAmount: number;
  totalQty: number;
  isActive: boolean;
  createdBy: string;
  userName: string;
  createdDate: string; 
  cusName:string;

  items?: Item[];
}
