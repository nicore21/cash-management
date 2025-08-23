export interface Customer {
  id: string;
  name: string;
  mobileNumber: string;
  address: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  createdAt: Date;
}

export type ServiceCategory = "BANKING" | "G2C" | "PRINT" | "DOC" | "OTHER";

export interface Service {
  code: string;
  name: string;
  defaultPrice: number;
  defaultCost: number;
  defaultPartnerFee: number;
  category: ServiceCategory;
  active: boolean;
  createdAt: Date;
}

export interface ServiceTransaction {
  id: string;
  serviceCode: string;
  serviceName: string; // denormalized for easy display
  qty: number;
  price: number;
  cost: number;
  partnerFee: number;
  profit: number;
  paymentMode: 'CASH' | 'UPI' | 'BANK';
  notes?: string;
  customerId?: string;
  customerName?: string; // denormalized
  createdAt: Date;
}

export interface CashTransaction {
  id: string;
  customerName: string;
  mobileNumber: string;
  bankName: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  createdAt: Date;
}
