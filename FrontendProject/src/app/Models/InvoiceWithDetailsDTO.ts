// invoice.model.ts
export interface InvoiceHeader {
  invoiceNo: string;
  invoiceId: string;
  customerId: number;
  invoiceDate: string;
  totalAmount: number;
  totalQty: number;
  isActive: boolean;
  createdBy: string;
  userName: string;
  createdDate: string;
  cusName?: string;
}

export interface InvoiceDetail {
  invoiceId: string;
  itemId: number;
  itemQty: number;
  rQty: number;
  price: number;
  discount: number;
  totalAmount: number;
  createdBy: string;
  userName: string;
  createdDate: string;
  itemName?: string;
}

export interface InvoiceWithDetailsDTO {
  header: InvoiceHeader;
  details: InvoiceDetail[];
}
