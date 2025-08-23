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
    const newCustomerSnap = await getDoc(docRef);
    const data = newCustomerSnap.data();
    return {
        id: newCustomerSnap.id,
        ...data,
        createdAt: (data!.createdAt as Timestamp).toDate(),
    } as Customer;
}


const serviceCatalog: Omit<Service, 'id' | 'createdAt' | 'active'>[] = [
    { name: 'Cash Deposit', code: 'CASH_DEPOSIT', category: 'BANKING', defaultPrice: 10, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Cash Withdrawal', code: 'CASH_WITHDRAWAL', category: 'BANKING', defaultPrice: 10, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Airtel Account', code: 'AIRTEL_ACCOUNT', category: 'BANKING', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Fino Account', code: 'FINO_ACCOUNT', category: 'BANKING', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Kotak Account', code: 'KOTAK_ACCOUNT', category: 'BANKING', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Aadhaar Print', code: 'AADHAAR_PRINT', category: 'PRINT', defaultPrice: 10, defaultCost: 2, defaultPartnerFee: 0 },
    { name: 'Ayushman Card', code: 'AYUSHMAN_CARD', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'eShram Card', code: 'ESHRAM_CARD', category: 'G2C', defaultPrice: 20, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Samagrah', code: 'SAMAGRAH', category: 'G2C', defaultPrice: 20, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'KYC', code: 'KYC', category: 'BANKING', defaultPrice: 30, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Life Certificate', code: 'LIFE_CERT', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Print Out B/W (per page)', code: 'PRINT_BW', category: 'PRINT', defaultPrice: 2, defaultCost: 1, defaultPartnerFee: 0 },
    { name: 'Print Out Color (per page)', code: 'PRINT_COLOR', category: 'PRINT', defaultPrice: 10, defaultCost: 5, defaultPartnerFee: 0 },
    { name: 'Lamination', code: 'LAMINATION', category: 'DOC', defaultPrice: 30, defaultCost: 15, defaultPartnerFee: 0 },
    { name: 'Income Certificate', code: 'INCOME_CERT', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Domestic Certificate', code: 'DOMESTIC_CERT', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Resume Making', code: 'RESUME', category: 'DOC', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Police Verification', code: 'POLICE_VERIFICATION', category: 'G2C', defaultPrice: 100, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'PAN Card', code: 'PAN_CARD', category: 'G2C', defaultPrice: 50, defaultCost: 0, defaultPartnerFee: 0 },
    { name: 'Other', code: 'OTHER', category: 'OTHER', defaultPrice: 0, defaultCost: 0, defaultPartnerFee: 0 },
];

async function seedServices() {
    const servicesCol = collection(db, 'services');
    const snapshot = await getDocs(servicesCol);
    if (snapshot.empty) {
        console.log("Services collection is empty. Seeding...");
        const batch = writeBatch(db);
        serviceCatalog.forEach(service => {
            const docRef = doc(db, 'services', service.code);
            batch.set(docRef, { 
                ...service, 
                active: true, 
                createdAt: Timestamp.now() 
            });
        });
        await batch.commit();
        console.log("Services seeded successfully.");
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
            code: serviceSnap.id,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as Service;
    }
    return undefined;
}

export async function getTransactions(status?: TransactionStatus): Promise<ServiceTransaction[]> {
    const transactionsCol = collection(db, 'transactions');
    let q;
    if (status) {
        q = query(transactionsCol, where('status', '==', status), orderBy('createdAt', 'desc'));
    } else {
        q = query(transactionsCol, orderBy('createdAt', 'desc'));
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

export async function addTransaction(transactionData: Omit<ServiceTransaction, 'id' | 'createdAt' | 'serviceName' | 'customerName' | 'customerMobile'>, customer?: Customer): Promise<ServiceTransaction> {
    const service = await getServiceByCode(transactionData.serviceCode);

    if (!service) throw new Error('Service not found');
    
    const docRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        serviceName: service.name,
        customerName: customer?.name,
        customerMobile: customer?.mobileNumber,
        createdAt: Timestamp.now(),
    });

    const newTxSnap = await getDoc(docRef);
    const data = newTxSnap.data()!

    return {
        ...data,
        id: docRef.id,
        createdAt: (data.createdAt as Timestamp).toDate(),
    } as ServiceTransaction;
}


export async function updateTransactionStatus(transactionId: string, newStatus: TransactionStatus): Promise<void> {
    const transactionRef = doc(db, 'transactions', transactionId);
    const transactionSnap = await getDoc(transactionRef);

    if (transactionSnap.exists()) {
        const transaction = transactionSnap.data() as ServiceTransaction;
        // Create a mutable copy for updates
        const updates: Partial<ServiceTransaction> = { status: newStatus };

        if (newStatus === 'PAID' && transaction.status === 'PENDING') {
            const isCashService = transaction.serviceCode.startsWith('CASH_');
            const potentialProfit = isCashService 
                ? transaction.price 
                : transaction.qty * (transaction.price - transaction.cost - transaction.partnerFee);
            
            updates.amountPaid = transaction.totalCharge;
            updates.pendingAmount = 0;
            updates.profit = potentialProfit; // Realize full profit
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

    // Profit is already calculated correctly upon transaction creation and update
    const dailyProfit = transactions
        .filter(t => t.createdAt >= today)
        .reduce((sum, t) => sum + t.profit, 0);

    const monthlyProfit = transactions
        .filter(t => t.createdAt >= startOfMonth)
        .reduce((sum, t) => sum + t.profit, 0);
    
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
