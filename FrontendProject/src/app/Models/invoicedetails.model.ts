export interface InvoiceDetail {
  invoiceId: string;   
  itemId: number;
  itemName: string;
  itemQty: number;
  rQty: number;
  discount: number;
  price: number;
  totalAmount: number;
}