import { Mall, Product, Bill, DashboardStats, Transaction, VerificationRecord } from '@/types';

export const mockMalls: Mall[] = [
  { id: 'mall-001', name: 'Phoenix MarketCity', location: 'Whitefield, Bangalore', operatingHours: '10:00 AM - 10:00 PM', shopCount: 245, gateCount: 4 },
  { id: 'mall-002', name: 'Orion Mall', location: 'Brigade Gateway, Bangalore', operatingHours: '10:00 AM - 11:00 PM', shopCount: 180, gateCount: 3 },
  { id: 'mall-003', name: 'Forum Mall', location: 'Koramangala, Bangalore', operatingHours: '10:00 AM - 10:00 PM', shopCount: 120, gateCount: 2 },
];

export const mockProducts: Product[] = [
  { id: 'prod-001', barcode: '8901234567890', name: 'Premium Basmati Rice', price: 299, tax: 14.95, category: 'Groceries', shopId: 'shop-001', shopName: 'Fresh Mart' },
  { id: 'prod-002', barcode: '8901234567891', name: 'Organic Green Tea', price: 450, tax: 22.5, category: 'Beverages', shopId: 'shop-002', shopName: 'Health Store' },
  { id: 'prod-003', barcode: '8901234567892', name: 'Wireless Earbuds Pro', price: 2999, tax: 539.82, category: 'Electronics', shopId: 'shop-003', shopName: 'TechZone' },
  { id: 'prod-004', barcode: '8901234567893', name: 'Cotton T-Shirt', price: 799, tax: 39.95, category: 'Apparel', shopId: 'shop-004', shopName: 'Fashion Hub' },
  { id: 'prod-005', barcode: '8901234567894', name: 'Dark Chocolate Bar', price: 180, tax: 9, category: 'Confectionery', shopId: 'shop-001', shopName: 'Fresh Mart' },
];

export const mockBills: Bill[] = [
  {
    id: 'BILL-2024-001', mallName: 'Phoenix MarketCity',
    items: [{ product: mockProducts[0], quantity: 2 }, { product: mockProducts[4], quantity: 3 }],
    subtotal: 1138, totalTax: 56.9, total: 1194.9, paymentStatus: 'paid', verificationStatus: 'verified', createdAt: new Date('2024-01-15T14:30:00'),
  },
  {
    id: 'BILL-2024-002', mallName: 'Orion Mall',
    items: [{ product: mockProducts[2], quantity: 1 }, { product: mockProducts[3], quantity: 2 }],
    subtotal: 4597, totalTax: 619.72, total: 5216.72, paymentStatus: 'paid', verificationStatus: 'pending', createdAt: new Date('2024-01-18T16:45:00'),
  },
];

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 1547890, transactionCount: 3456, activeUsers: 12890, peakHour: '6:00 PM - 8:00 PM',
  revenueChange: 12.5, transactionChange: 8.3, userChange: 15.7,
};

export const mockTransactions: Transaction[] = [
  { id: 'txn-001', billId: 'BILL-2024-001', mallName: 'Phoenix MarketCity', shopName: 'Fresh Mart', amount: 1194.9, status: 'completed', paymentMethod: 'UPI', createdAt: new Date('2024-01-15T14:30:00'), customerName: 'Rahul Sharma' },
  { id: 'txn-002', billId: 'BILL-2024-002', mallName: 'Orion Mall', shopName: 'TechZone', amount: 5216.72, status: 'completed', paymentMethod: 'UPI', createdAt: new Date('2024-01-18T16:45:00'), customerName: 'Priya Patel' },
  { id: 'txn-003', billId: 'BILL-2024-003', mallName: 'Forum Mall', shopName: 'Fashion Hub', amount: 2450, status: 'pending', paymentMethod: 'UPI', createdAt: new Date('2024-01-19T11:20:00'), customerName: 'Amit Kumar' },
];

export const mockVerificationRecords: VerificationRecord[] = [
  { id: 'ver-001', billId: 'BILL-2024-001', status: 'allowed', timestamp: new Date('2024-01-15T15:00:00'), itemCount: 5, totalAmount: 1194.9, paymentStatus: 'paid' },
  { id: 'ver-002', billId: 'BILL-2024-004', status: 'flagged', note: 'Payment pending', timestamp: new Date('2024-01-16T12:30:00'), itemCount: 3, totalAmount: 890, paymentStatus: 'unpaid' },
];

export const revenueChartData = [
  { name: 'Mon', revenue: 145000 }, { name: 'Tue', revenue: 178000 }, { name: 'Wed', revenue: 165000 },
  { name: 'Thu', revenue: 198000 }, { name: 'Fri', revenue: 245000 }, { name: 'Sat', revenue: 312000 }, { name: 'Sun', revenue: 289000 },
];

export const categoryDistribution = [
  { name: 'Electronics', value: 35 }, { name: 'Apparel', value: 25 }, { name: 'Groceries', value: 20 },
  { name: 'Food & Beverages', value: 12 }, { name: 'Others', value: 8 },
];
