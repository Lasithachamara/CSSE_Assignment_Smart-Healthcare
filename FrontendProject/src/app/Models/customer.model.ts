export interface Customer {
  id?: number;
  nic: string;
  name: string;
  mobileNo: number;
  createdBy?: string;
  createdDate?: string;
  isActive?: boolean;
}