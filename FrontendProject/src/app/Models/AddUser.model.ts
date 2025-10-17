export interface AddUser {
  id?: number;
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
}