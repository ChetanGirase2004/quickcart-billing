export interface Admin {
  uid: string;
  mallName: string;
  adminName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: Date;
}

export interface AdminFormData {
  mallName: string;
  adminName: string;
  email: string;
  password: string;
  phone: string;
}