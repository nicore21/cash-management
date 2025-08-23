import type { Customer, Service, ServiceTransaction, TransactionStatus } from './types';

// Mock data storage
let customers: Customer[] = [
    {
        id: 'cust_1',
        name: 'Amit Kumar',
        mobileNumber: '9876543210',
        address: '123, Main St, Delhi',
        bankName: 'State Bank of India',
        accountNumber: '12345678901',
        ifscCode: 'SBIN0001234',
        createdAt: new Date('2024-07-20T10:00:00Z'),
    },
    {
        id: 'cust_2',
        name: 'Priya Sharma',
        mobileNumber: '8765432109',
        address: '456, Park Avenue, Mumbai',
        bankName: 'HDFC Bank',
        accountNumber: '09876543210',
        ifscCode: 'HDFC0000456',
        createdAt: new Date('2024-07-21T11:30:00Z'),
    },
];

const now = new Date();
const serviceCatalog: Service[] = [
  // New Cash Transaction services
  { code: 'CASH_DEPOSIT', name: 'Cash Deposit', category: 'BANKING', defaultPrice: 10, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'CASH_WITHDRAWAL', name: 'Cash Withdrawal', category: 'BANKING', defaultPrice: 10, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  
  { code: 'AIRTEL_ACCOUNT', name: 'Airtel Account', category: 'BANKING', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'FINO_ACCOUNT', name: 'Fino Account', category: 'BANKING', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'KOTAK_ACCOUNT', name: 'Kotak Account', category: 'BANKING', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'AADHAAR_PRINT', name: 'Aadhaar Print', category: 'PRINT', defaultPrice: 10, defaultCost: 2, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'AYUSHMAN_CARD', name: 'Ayushman Card', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'ESHRAM_CARD', name: 'eShram Card', category: 'G2C', defaultPrice: 20, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'SAMAGRAH', name: 'Samagrah', category: 'G2C', defaultPrice: 20, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'KYC', name: 'KYC', category: 'BANKING', defaultPrice: 30, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'LIFE_CERT', name: 'Life Certificate', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'PRINT_BW', name: 'Print Out B/W (per page)', category: 'PRINT', defaultPrice: 2, defaultCost: 1, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'PRINT_COLOR', name: 'Print Out Color (per page)', category: 'PRINT', defaultPrice: 10, defaultCost: 5, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'LAMINATION', name: 'Lamination', category: 'DOC', defaultPrice: 30, defaultCost: 15, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'INCOME_CERT', name: 'Income Certificate', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'DOMESTIC_CERT', name: 'Domestic Certificate', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'RESUME', name: 'Resume Making', category: 'DOC', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'POLICE_VERIFICATION', name: 'Police Verification', category: 'G2C', defaultPrice: 100, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'PAN_CARD', name: 'PAN Card', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
  { code: 'OTHER', name: 'Other', category: 'OTHER', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0, active: true, createdAt: now },
];

let serviceTransactions: ServiceTransaction[] = [
    {
        id: 'txn_1',
        serviceCode: 'AADHAAR_PRINT',
        serviceName: 'Aadhaar Print',
        qty: 2,
        price: 10,
        cost: 2,
        partnerFee: 0,
        totalCharge: 20,
        amountPaid: 20,
        pendingAmount: 0,
        profit: 16,
        status: 'PAID',
        paymentMode: 'CASH',
        customerId: 'cust_1',
        customerName: 'Amit Kumar',
        customerMobile: '9876543210',
        createdAt: new Date('2024-07-22T09:15:00Z'),
    },
    {
        id: 'txn_2',
        serviceCode: 'KYC',
        serviceName: 'KYC',
        qty: 1,
        price: 30,
        cost: 0,
        partnerFee: 0,
        totalCharge: 30,
        amountPaid: 30,
        pendingAmount: 0,
        profit: 30,
        status: 'PAID',
        paymentMode: 'UPI',
        customerId: 'cust_2',
        customerName: 'Priya Sharma',
        customerMobile: '8765432109',
        createdAt: new Date(), // Today
    },
    {
        id: 'txn_3',
        serviceCode: 'CASH_DEPOSIT',
        serviceName: 'Cash Deposit',
        qty: 1,
        price: 10, // This is the charge/fee
        cost: 0,
        partnerFee: 0,
        totalCharge: 10,
        amountPaid: 10,
        pendingAmount: 0,
        profit: 10,
        status: 'PAID',
        paymentMode: 'CASH',
        customerId: undefined,
        customerName: 'Walk-in Customer',
        createdAt: new Date(), // Today
        cashTransactionAmount: 5000,
        cashTransactionType: 'DEPOSIT',
        cashTransactionBankName: 'State Bank of India',
    },
    {
        id: 'txn_4',
        serviceCode: 'AYUSHMAN_CARD',
        serviceName: 'Ayushman Card',
        qty: 1,
        price: 50,
        cost: 0,
        partnerFee: 0,
        totalCharge: 50,
        amountPaid: 20,
        pendingAmount: 30,
        profit: 20, // Profit on paid amount: 20 (paid) / 50 (total) * 50 (total profit) = 20
        status: 'PENDING',
        paymentMode: 'CASH',
        customerId: 'cust_1',
        customerName: 'Amit Kumar',
        customerMobile: '9876543210',
        createdAt: new Date(), // Today
    }
];

// Data access functions
export async function getCustomers(): Promise<Customer[]> {
    return customers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
    return customers.find(c => c.id === id);
}

export async function addCustomer(customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const newCustomer: Customer = {
        ...customerData,
        id: `cust_${Date.now()}`,
        createdAt: new Date(),
    };
    customers.push(newCustomer);
    return newCustomer;
}

export async function getServices(): Promise<Service[]> {
    return serviceCatalog.filter(s => s.active);
}

export async function getServiceByCode(code: string): Promise<Service | undefined> {
    return serviceCatalog.find(s => s.code === code);
}

export async function getTransactions(status?: TransactionStatus): Promise<ServiceTransaction[]> {
    let txs = serviceTransactions;
    if (status) {
        txs = txs.filter(tx => tx.status === status);
    }
    return txs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function addTransaction(transactionData: Omit<ServiceTransaction, 'id' | 'createdAt' | 'customerName' | 'customerMobile' | 'serviceName'>, customer?: Customer): Promise<ServiceTransaction> {
    const service = await getServiceByCode(transactionData.serviceCode);

    if (!service) throw new Error('Service not found');

    const newTransaction: ServiceTransaction = {
        ...transactionData,
        id: `txn_${Date.now()}`,
        customerName: customer?.name || (transactionData.serviceCode.startsWith('CASH_') ? 'Walk-in Customer' : undefined),
        customerMobile: customer?.mobileNumber,
        serviceName: service.name,
        createdAt: new Date(),
    };
    serviceTransactions.push(newTransaction);
    return newTransaction;
}

export async function updateTransactionStatus(transactionId: string, newStatus: TransactionStatus): Promise<ServiceTransaction | undefined> {
    const transaction = serviceTransactions.find(t => t.id === transactionId);
    if (transaction) {
        transaction.status = newStatus;
        if (newStatus === 'PAID') {
            const potentialProfit = transaction.qty * (transaction.price - transaction.cost - transaction.partnerFee);
            transaction.amountPaid = transaction.totalCharge;
            transaction.pendingAmount = 0;
            transaction.profit = potentialProfit;
        }
    }
    return transaction;
}

export async function getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Only consider fully PAID transactions for profit calculations
    const paidTransactions = serviceTransactions.filter(t => t.status === 'PAID');
    const dailyPaidTransactions = paidTransactions.filter(t => t.createdAt >= today);
    const monthlyPaidTransactions = paidTransactions.filter(t => t.createdAt >= startOfMonth);

    const dailyProfit = dailyPaidTransactions.reduce((sum, t) => sum + t.profit, 0);
    const monthlyProfit = monthlyPaidTransactions.reduce((sum, t) => sum + t.profit, 0);
    
    const totalPendingAmount = serviceTransactions
        .filter(t => t.status === 'PENDING')
        .reduce((sum, t) => sum + t.pendingAmount, 0);

    const totalCustomers = customers.length;
    const servicesToday = serviceTransactions.filter(t => t.createdAt >= today).length;
    
    const dailyCashTransactions = serviceTransactions.filter(t => t.createdAt >= today && t.cashTransactionAmount && t.cashTransactionType);
    const dailyDeposit = dailyCashTransactions
        .filter(t => t.cashTransactionType === 'DEPOSIT')
        .reduce((sum, t) => sum + (t.cashTransactionAmount || 0), 0);
    const dailyWithdrawal = dailyCashTransactions
        .filter(t => t.cashTransactionType === 'WITHDRAWAL')
        .reduce((sum, t) => sum + (t.cashTransactionAmount || 0), 0);
    const dailyNetCash = dailyDeposit - dailyWithdrawal;

    return {
        dailyProfit,
        monthlyProfit,
        totalCustomers,
        servicesToday,
        dailyDeposit,
        dailyWithdrawal,
        dailyNetCash,
        totalPendingAmount,
    };
}
