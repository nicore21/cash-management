'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createCustomer } from '@/lib/actions';
import { useState } from 'react';
import type { Customer } from '@/lib/types';

const CustomerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: "Mobile number must be 10 digits." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof CustomerSchema>;

interface CustomerFormProps {
    onCustomerAdded: (customer: Customer) => void;
}

export default function CustomerForm({ onCustomerAdded }: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      name: '',
      mobileNumber: '',
      address: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
    },
  });

  async function onSubmit(data: CustomerFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    const result = await createCustomer(formData);
    
    if (result.success && result.data) {
      toast({
        title: "Success",
        description: result.message,
      });
      onCustomerAdded(result.data);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
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
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter full address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
            <p className="text-sm font-medium">Bank Details (Optional)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., SBI" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 12345678901" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ifscCode"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>IFSC Code</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., SBIN0001234" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Adding Customer...' : 'Add Customer'}
        </Button>
      </form>
    </Form>
  );
}
