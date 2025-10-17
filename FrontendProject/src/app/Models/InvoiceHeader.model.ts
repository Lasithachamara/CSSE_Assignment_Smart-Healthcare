export interface InvoiceHeader {
  invoiceId?: string;   
  invoiceNo: string;
  customerId: number;
  invoiceDate: string;
  totalAmount: number;
  totalQty: number;
  isActive: boolean;
  createdBy: string;
  userName: string;
  createdDate: string; 
  cusName: string;
}