'use server';

import { z } from 'zod';
import { addCustomer, addTransaction, getServiceByCode, addCashTransaction } from './data';
import type { Customer, ServiceTransaction, CashTransaction } from './types';
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

    try {
        const newCustomer = await addCustomer(validatedFields.data);
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
  qty: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  price: z.coerce.number().min(0, "Price must be non-negative."),
  cost: z.coerce.number().min(0, "Cost must be non-negative."),
  partnerFee: z.coerce.number().min(0, "Partner fee must be non-negative."),
  paymentMode: z.enum(['CASH', 'UPI', 'BANK']),
  notes: z.string().optional(),
});

export async function createServiceTransaction(formData: FormData): Promise<{ success: boolean; message: string; data?: ServiceTransaction }> {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = ServiceTransactionSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        return { success: false, message: "Invalid form data." };
    }
    
    const { serviceCode, qty, price, cost, partnerFee, customerId, paymentMode, notes } = validatedFields.data;

    const service = await getServiceByCode(serviceCode);
    if (!service) {
        return { success: false, message: "Invalid service selected." };
    }

    try {
        const profit = qty * (price - cost - partnerFee);

        const transactionData = {
            serviceCode,
            qty,
            price,
            cost,
            partnerFee,
            profit,
            customerId,
            paymentMode,
            notes,
        };

        const newTransaction = await addTransaction(transactionData);
        revalidatePath('/services');
        revalidatePath('/transactions');
        revalidatePath('/');
        return { success: true, message: "Transaction logged successfully.", data: newTransaction };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to log transaction.";
        return { success: false, message };
    }
}


const CashTransactionSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters."),
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits."),
  bankName: z.string().min(2, "Bank name is required."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  type: z.enum(['DEPOSIT', 'WITHDRAWAL']),
});


export async function createCashTransaction(formData: FormData): Promise<{ success: boolean; message: string; data?: CashTransaction }> {
    const validatedFields = CashTransactionSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        return { success: false, message: "Invalid form data." };
    }
    
    try {
        const newTransaction = await addCashTransaction(validatedFields.data);
        revalidatePath('/cash-dw');
        revalidatePath('/');
        return { success: true, message: "Transaction recorded successfully.", data: newTransaction };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to record transaction.";
        return { success: false, message };
    }
}
