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

export interface ServiceTransaction {
  id: string;
  serviceName: string;
  chargeAmount: number;
  type: 'deposit' | 'withdrawal' | 'service';
  amount?: number; // for withdrawal/deposit
  customerId: string;
  customerName: string; // denormalized for easy display
  createdAt: Date;
}
