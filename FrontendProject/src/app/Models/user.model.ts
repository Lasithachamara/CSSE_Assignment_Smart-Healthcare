export interface User {
  id: number;
  nic: string;
  name: string;
  userName: string;
  email: string;
  password: string;
  accessLevel: number;
  activeStatus: boolean;
  mobile: string;
  createdBy: string;
  createdDate: string;

  firstName: string;
  lastName: string;
  dateOfBirth?: string; // can be Date string (e.g., "2025-10-11T00:00:00")
  gender?: string;
  address?: string;
  bloodType?: string;
  Qrcode?: string;

  // Optional: If backend returns states or roles for future use
  states?: string;
  role?: string;
}
