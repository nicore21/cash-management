import type { Customer, ServiceTransaction } from './types';

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

let transactions: ServiceTransaction[] = [
    {
        id: 'txn_1',
        serviceName: 'Aadhaar Card Xerox',
        chargeAmount: 10,
        type: 'service',
        customerId: 'cust_1',
        customerName: 'Amit Kumar',
        createdAt: new Date('2024-07-22T09:15:00Z'),
    },
    {
        id: 'txn_2',
        serviceName: 'Cash Withdrawal',
        chargeAmount: 25,
        type: 'withdrawal',
        amount: 5000,
        customerId: 'cust_2',
        customerName: 'Priya Sharma',
        createdAt: new Date(), // Today
    },
    {
        id: 'txn_3',
        serviceName: 'PAN Card Application',
        chargeAmount: 150,
        type: 'service',
        customerId: 'cust_2',
        customerName: 'Priya Sharma',
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

export async function getTransactions(): Promise<ServiceTransaction[]> {
    return transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function addTransaction(transactionData: Omit<ServiceTransaction, 'id' | 'createdAt' | 'customerName'>): Promise<ServiceTransaction> {
    const customer = await getCustomerById(transactionData.customerId);
    if (!customer) throw new Error('Customer not found');
    const newTransaction: ServiceTransaction = {
        ...transactionData,
        id: `txn_${Date.now()}`,
        customerName: customer.name,
        createdAt: new Date(),
    };
    transactions.push(newTransaction);
    return newTransaction;
}

export async function getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const dailyTransactions = transactions.filter(t => t.createdAt >= today);
    const monthlyTransactions = transactions.filter(t => t.createdAt >= startOfMonth);

    const dailyProfit = dailyTransactions.reduce((sum, t) => sum + t.chargeAmount, 0);
    const monthlyProfit = monthlyTransactions.reduce((sum, t) => sum + t.chargeAmount, 0);

    const totalCustomers = customers.length;
    const servicesToday = dailyTransactions.length;

    return {
        dailyProfit,
        monthlyProfit,
        totalCustomers,
        servicesToday,
    };
}
