'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { CashTransaction } from '@/lib/types';
import { createCashTransaction } from '@/lib/actions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const CashTransactionSchema = z.object({
  customerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: "Mobile number must be 10 digits." }),
  bankName: z.string().min(2, { message: "Bank name is required." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  type: z.enum(['DEPOSIT', 'WITHDRAWAL'], { required_error: "Transaction type is required." }),
});

type FormValues = z.infer<typeof CashTransactionSchema>;

interface CashTransactionFormProps {
    onTransactionAdded: (transaction: CashTransaction) => void;
}

export default function CashTransactionForm({ onTransactionAdded }: CashTransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(CashTransactionSchema),
    defaultValues: {
      customerName: '',
      mobileNumber: '',
      bankName: '',
      type: 'DEPOSIT',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const result = await createCashTransaction(formData);
    
    if (result.success && result.data) {
      toast({
        title: "Success",
        description: result.message,
      });
      onTransactionAdded(result.data);
      form.reset();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Transaction Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="DEPOSIT" /></FormControl>
                    <FormLabel className="font-normal">Deposit</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="WITHDRAWAL" /></FormControl>
                    <FormLabel className="font-normal">Withdrawal</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                    <Input placeholder="Enter customer's name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                    <Input type="tel" placeholder="Enter 10-digit number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., SBI, HDFC" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Add Transaction'}
        </Button>
      </form>
    </Form>
  );
}
