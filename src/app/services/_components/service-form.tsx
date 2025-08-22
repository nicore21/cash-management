'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { createServiceTransaction } from '@/lib/actions';
import { useState } from 'react';
import type { Customer } from '@/lib/types';

const ServiceTransactionSchema = z.object({
  customerId: z.string().min(1, { message: "Customer is required." }),
  serviceName: z.string().min(3, { message: "Service name is required." }),
  chargeAmount: z.coerce.number().min(0, { message: "Charge must be a non-negative number." }),
  type: z.enum(['service', 'withdrawal', 'deposit']),
  amount: z.coerce.number().optional(),
}).refine(data => {
    if (data.type === 'withdrawal' || data.type === 'deposit') {
        return data.amount !== undefined && data.amount > 0;
    }
    return true;
}, {
    message: "A positive amount is required for withdrawals and deposits.",
    path: ['amount'],
});

type ServiceFormValues = z.infer<typeof ServiceTransactionSchema>;

interface ServiceFormProps {
    customers: Customer[];
}

export default function ServiceForm({ customers }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceTransactionSchema),
    defaultValues: {
      customerId: '',
      serviceName: '',
      chargeAmount: 0,
      type: 'service',
    },
  });

  const transactionType = form.watch('type');

  async function onSubmit(data: ServiceFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    
    if (data.type === 'service') {
        delete data.amount;
    }
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(String(key), String(value));
      }
    });

    const result = await createServiceTransaction(formData);
    
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
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
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Customer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>{customer.name} - {customer.mobileNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Transaction Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="service" /></FormControl>
                    <FormLabel className="font-normal">Service</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="withdrawal" /></FormControl>
                    <FormLabel className="font-normal">Withdrawal</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="deposit" /></FormControl>
                    <FormLabel className="font-normal">Deposit</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="serviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service / Transaction Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., PAN Card Xerox, Cash Withdrawal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {(transactionType === 'withdrawal' || transactionType === 'deposit') && (
            <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{transactionType === 'withdrawal' ? 'Withdrawal' : 'Deposit'} Amount</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="Enter amount in INR" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        )}

        <FormField
          control={form.control}
          name="chargeAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Charge (Commission)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Enter charge amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Log Transaction'}
        </Button>
      </form>
    </Form>
  );
}
