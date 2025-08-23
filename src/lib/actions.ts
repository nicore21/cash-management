'use server';

import { z } from 'zod';
import { addCustomer, addTransaction, getServiceByCode, updateTransactionStatus as dbUpdateTransactionStatus, getCustomerById } from './data';
import type { Customer, ServiceTransaction, TransactionStatus } from './types';
import { revalidatePath } from 'next/cache';

const CustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
});

export async function createCustomer(formData: FormData): Promise<{ success: boolean; message: string; data?: Customer }> {
    const validatedFields = CustomerSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, message: "Invalid form data." };
    }
    
    const { data } = validatedFields;
    const customerData = {
        ...data,
        bankName: data.bankName || 'NA',
        accountNumber: data.accountNumber || 'NA',
        ifscCode: data.ifscCode || 'NA',
    };

    try {
        const newCustomer = await addCustomer(customerData);
        revalidatePath('/customers');
        revalidatePath('/services');
        return { success: true, message: "Customer created successfully.", data: newCustomer };
    } catch (error) {
        return { success: false, message: "Failed to create customer." };
    }
}

const ServiceTransactionSchema = z.object({
  serviceCode: z.string().min(1, "Service is required."),
  customerId: z.string().optional(),
  qty: z.coerce.number().int().min(1, "Quantity must be at least 1.").default(1),
  price: z.coerce.number().min(0, "Price/Fee must be a non-negative number.").default(0),
  cost: z.coerce.number().min(0, "Cost must be non-negative.").default(0),
  partnerFee: z.coerce.number().min(0, "Partner fee must be non-negative.").default(0),
  totalCharge: z.coerce.number().min(0, "Total Charge must be non-negative.").default(0),
  amountPaid: z.coerce.number().min(0, "Amount Paid must be non-negative.").default(0),
  paymentMode: z.enum(['CASH', 'UPI', 'BANK']),
  notes: z.string().optional(),
  // Fields for cash transactions
  cashTransactionAmount: z.coerce.number().optional().default(0),
  cashTransactionBankName: z.string().optional(),
}).refine(data => data.amountPaid <= data.totalCharge, {
    message: "Amount paid cannot be greater than total charge.",
    path: ["amountPaid"],
});

export async function createServiceTransaction(formData: FormData): Promise<{ success: boolean; message: string; data?: ServiceTransaction }> {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = ServiceTransactionSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0] ?? "Invalid form data.";
        return { success: false, message: firstError };
    }
    
    const { serviceCode, qty, price, cost, partnerFee, customerId, paymentMode, notes, cashTransactionAmount, cashTransactionBankName, totalCharge, amountPaid } = validatedFields.data;

    const service = await getServiceByCode(serviceCode);
    if (!service) {
        return { success: false, message: "Invalid service selected." };
    }

    const customer = (customerId && customerId !== 'NA') ? await getCustomerById(customerId) : undefined;


    const isCashService = service.code.startsWith('CASH_');
    if (isCashService && (!cashTransactionAmount || cashTransactionAmount <= 0)) {
        return { success: false, message: "Please enter a valid transaction amount." };
    }
     if (isCashService && (!cashTransactionBankName || cashTransactionBankName.length < 2)) {
        return { success: false, message: "Please enter a valid bank name." };
    }

    try {
        const pendingAmount = totalCharge - amountPaid;
        const status: TransactionStatus = pendingAmount > 0 ? 'PENDING' : 'PAID';
        
        const potentialProfit = isCashService ? price : qty * (price - cost - partnerFee);

        // Profit is realized based on the proportion of the amount paid
        const profit = totalCharge > 0 ? (amountPaid / totalCharge) * potentialProfit : potentialProfit;

        const transactionData: Omit<ServiceTransaction, 'id' | 'createdAt' | 'serviceName'> = {
            serviceCode,
            qty: isCashService ? 1 : qty,
            price,
            cost: isCashService ? 0 : cost,
            partnerFee: isCashService ? 0 : partnerFee,
            totalCharge,
            amountPaid,
            pendingAmount,
            profit,
            status,
            customerId: customer?.id || 'NA',
            customerName: customer?.name || 'NA',
            customerMobile: customer?.mobileNumber || 'NA',
            paymentMode,
            notes: notes || 'NA',
        };

        if (isCashService) {
            transactionData.cashTransactionAmount = cashTransactionAmount;
            transactionData.cashTransactionType = service.code === 'CASH_DEPOSIT' ? 'DEPOSIT' : 'WITHDRAWAL';
            transactionData.cashTransactionBankName = cashTransactionBankName || 'NA';
            // For cash services, total charge is just the fee itself
            transactionData.totalCharge = price;
            transactionData.amountPaid = price;
            transactionData.pendingAmount = 0;
            transactionData.status = 'PAID';
            transactionData.profit = price;
        }

        const newTransaction = await addTransaction(transactionData);
        revalidatePath('/services');
        revalidatePath('/transactions');
        revalidatePath('/pending-work');
        revalidatePath('/');
        return { success: true, message: "Transaction logged successfully.", data: newTransaction };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to log transaction.";
        return { success: false, message };
    }
}

export async function updateTransactionStatusAction(transactionId: string, newStatus: TransactionStatus): Promise<{ success: boolean; message: string; }> {
    try {
        await dbUpdateTransactionStatus(transactionId, newStatus);
        revalidatePath('/pending-work');
        revalidatePath('/transactions');
        revalidatePath('/');
        return { success: true, message: "Transaction status updated." };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update status.";
        return { success: false, message };
    }
}
