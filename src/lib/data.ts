import { db } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, query, where, orderBy, Timestamp, writeBatch } from "firebase/firestore";
import type { Customer, Service, ServiceTransaction, TransactionStatus } from './types';

// Data access functions
export async function getCustomers(): Promise<Customer[]> {
    const customersCol = collection(db, 'customers');
    const customerSnapshot = await getDocs(query(customersCol, orderBy('createdAt', 'desc')));
    const customerList = customerSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as Customer;
    });
    return customerList;
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
    const customerRef = doc(db, 'customers', id);
    const customerSnap = await getDoc(customerRef);
    if (customerSnap.exists()) {
        const data = customerSnap.data();
        return {
            id: customerSnap.id,
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as Customer;
    }
    return undefined;
}

export async function addCustomer(customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const customersCol = collection(db, 'customers');
    const docRef = await addDoc(customersCol, {
        ...customerData,
        createdAt: Timestamp.now(),
    });
    return {
        ...customerData,
        id: docRef.id,
        createdAt: new Date(),
    };
}


const serviceCatalog: Omit<Service, 'code' | 'createdAt' | 'active'>[] = [
    { name: 'Cash Deposit', category: 'BANKING', defaultPrice: 10, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Cash Withdrawal', category: 'BANKING', defaultPrice: 10, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Airtel Account', category: 'BANKING', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Fino Account', category: 'BANKING', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Kotak Account', category: 'BANKING', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Aadhaar Print', category: 'PRINT', defaultPrice: 10, defaultCost: 2, defaultPartnerFee: 0 },
    { name: 'Ayushman Card', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'eShram Card', category: 'G2C', defaultPrice: 20, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Samagrah', category: 'G2C', defaultPrice: 20, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'KYC', category: 'BANKING', defaultPrice: 30, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Life Certificate', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Print Out B/W (per page)', category: 'PRINT', defaultPrice: 2, defaultCost: 1, defaultPartnerFee: 0 },
    { name: 'Print Out Color (per page)', category: 'PRINT', defaultPrice: 10, defaultCost: 5, defaultPartnerFee: 0 },
    { name: 'Lamination', category: 'DOC', defaultPrice: 30, defaultCost: 15, defaultPartnerFee: 0 },
    { name: 'Income Certificate', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Domestic Certificate', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Resume Making', category: 'DOC', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Police Verification', category: 'G2C', defaultPrice: 100, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'PAN Card', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Other', category: 'OTHER', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0 },
];

async function seedServices() {
    const servicesCol = collection(db, 'services');
    const snapshot = await getDocs(servicesCol);
    if (snapshot.empty) {
        console.log("Seeding services...");
        const batch = writeBatch(db);
        serviceCatalog.forEach(service => {
            const code = service.name.toUpperCase().replace(/ /g, '_').replace(/\//g, '').replace(/\(/g, '').replace(/\)/g, '');
            const docRef = doc(db, 'services', code);
            batch.set(docRef, { 
                ...service, 
                code, 
                active: true, 
                createdAt: Timestamp.now() 
            });
        });
        await batch.commit();
        console.log("Services seeded.");
    }
}


export async function getServices(): Promise<Service[]> {
    await seedServices();
    const servicesCol = collection(db, 'services');
    const serviceSnapshot = await getDocs(query(servicesCol, where('active', '==', true)));
    const serviceList = serviceSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as Service;
    });
    return serviceList;
}

export async function getServiceByCode(code: string): Promise<Service | undefined> {
    const serviceRef = doc(db, 'services', code);
    const serviceSnap = await getDoc(serviceRef);
    if (serviceSnap.exists()) {
        const data = serviceSnap.data();
        return {
            ...data,
            id: serviceSnap.id,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as Service;
    }
    return undefined;
}

export async function getTransactions(status?: TransactionStatus): Promise<ServiceTransaction[]> {
    const transactionsCol = collection(db, 'transactions');
    let q = query(transactionsCol, orderBy('createdAt', 'desc'));
    if (status) {
        q = query(transactionsCol, where('status', '==', status), orderBy('createdAt', 'desc'));
    }
    const transactionSnapshot = await getDocs(q);
    const transactionList = transactionSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as ServiceTransaction;
    });
    return transactionList;
}

export async function addTransaction(transactionData: Omit<ServiceTransaction, 'id' | 'createdAt'>, customer?: Customer): Promise<ServiceTransaction> {
    const service = await getServiceByCode(transactionData.serviceCode);

    if (!service) throw new Error('Service not found');
    
    const docRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        serviceName: service.name,
        customerName: customer?.name || (transactionData.serviceCode.startsWith('CASH_') ? 'Walk-in Customer' : undefined),
        customerMobile: customer?.mobileNumber,
        createdAt: Timestamp.now(),
    });

    return {
        ...transactionData,
        id: docRef.id,
        serviceName: service.name,
        customerName: customer?.name || (transactionData.serviceCode.startsWith('CASH_') ? 'Walk-in Customer' : undefined),
        customerMobile: customer?.mobileNumber,
        createdAt: new Date(),
    };
}


export async function updateTransactionStatus(transactionId: string, newStatus: TransactionStatus): Promise<void> {
    const transactionRef = doc(db, 'transactions', transactionId);
    const transactionSnap = await getDoc(transactionRef);

    if (transactionSnap.exists()) {
        const transaction = transactionSnap.data() as ServiceTransaction;
        const updates: Partial<ServiceTransaction> = { status: newStatus };

        if (newStatus === 'PAID') {
            const potentialProfit = transaction.qty * (transaction.price - transaction.cost - transaction.partnerFee);
            updates.amountPaid = transaction.totalCharge;
            updates.pendingAmount = 0;
            updates.profit = potentialProfit;
        }
        
        await updateDoc(transactionRef, updates);
    } else {
        throw new Error("Transaction not found");
    }
}

export async function getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const transactions = await getTransactions(); // Fetch all transactions once

    // Only consider fully PAID transactions for profit calculations
    const paidTransactions = transactions.filter(t => t.status === 'PAID');
    const dailyPaidTransactions = paidTransactions.filter(t => t.createdAt >= today);
    const monthlyPaidTransactions = paidTransactions.filter(t => t.createdAt >= startOfMonth);

    const dailyProfit = dailyPaidTransactions.reduce((sum, t) => sum + t.profit, 0);
    const monthlyProfit = monthlyPaidTransactions.reduce((sum, t) => sum + t.profit, 0);
    
    const totalPendingAmount = transactions
        .filter(t => t.status === 'PENDING')
        .reduce((sum, t) => sum + t.pendingAmount, 0);

    const customers = await getCustomers();
    const totalCustomers = customers.length;
    
    const dailyCashTransactions = transactions.filter(t => t.createdAt >= today && t.cashTransactionAmount && t.cashTransactionType);
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
        servicesToday: transactions.filter(t => t.createdAt >= today).length,
        dailyDeposit,
        dailyWithdrawal,
        dailyNetCash,
        totalPendingAmount,
    };
}
