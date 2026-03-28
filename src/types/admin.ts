export interface Admin {
  uid: string;
  shopName: string;
  shopAddress: string;
  adminName: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface AdminFormData {
  shopName: string;
  shopAddress: string;
  adminName: string;
  email: string;
  password: string;
}