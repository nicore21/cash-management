'use server';

import { z } from 'zod';
import { addCustomer, addTransaction } from './data';
import type { Customer, ServiceTransaction } from './types';
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
  customerId: z.string().min(1, "Customer is required."),
  serviceName: z.string().min(3, "Service name is required."),
  chargeAmount: z.coerce.number().positive("Charge must be positive."),
  type: z.enum(['service', 'withdrawal', 'deposit']),
  amount: z.coerce.number().optional(),
});

export async function createServiceTransaction(formData: FormData): Promise<{ success: boolean; message: string; data?: ServiceTransaction }> {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = ServiceTransactionSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        return { success: false, message: "Invalid form data." };
    }

    try {
        const newTransaction = await addTransaction(validatedFields.data);
        revalidatePath('/services');
        revalidatePath('/transactions');
        revalidatePath('/');
        return { success: true, message: "Service logged successfully.", data: newTransaction };
    } catch (error) {
        return { success: false, message: "Failed to log service." };
    }
}
