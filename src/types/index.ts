export type UserRole = 'customer' | 'admin' | 'guard';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

export interface Mall {
  id: string;
  name: string;
  location: string;
  operatingHours: string;
  image?: string;
  shopCount: number;
  gateCount: number;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
  tax: number;
  category: string;
  shopId: string;
  shopName: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  mallId: string;
  mallName: string;
  totalItems: number;
  subtotal: number;
  totalTax: number;
  total: number;
}

export interface Bill {
  id: string;
  mallName: string;
  items: CartItem[];
  subtotal: number;
  totalTax: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  verificationStatus: 'pending' | 'verified' | 'flagged';
  createdAt: Date;
}

export interface VerificationRecord {
  id: string;
  billId: string;
  status: 'allowed' | 'flagged';
  note?: string;
  timestamp: Date;
  itemCount: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'unpaid';
}

export interface DashboardStats {
  totalRevenue: number;
  transactionCount: number;
  activeUsers: number;
  peakHour: string;
  revenueChange: number;
  transactionChange: number;
  userChange: number;
}

export interface Transaction {
  id: string;
  billId: string;
  mallName: string;
  shopName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: Date;
  customerName: string;
}
