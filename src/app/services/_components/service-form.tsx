'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Customer, Service } from '@/lib/types';
import { createServiceTransaction } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { IndianRupee } from 'lucide-react';

const ServiceTransactionSchema = z.object({
  serviceCode: z.string().min(1, "Please select a service."),
  customerId: z.string().optional(),
  qty: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  price: z.coerce.number().min(0, "Price must be a non-negative number."),
  cost: z.coerce.number().min(0, "Cost must be a non-negative number."),
  partnerFee: z.coerce.number().min(0, "Partner fee must be a non-negative number."),
  paymentMode: z.enum(['CASH', 'UPI', 'BANK'], { required_error: 'Payment mode is required.' }),
  notes: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof ServiceTransactionSchema>;

interface ServiceFormProps {
    customers: Customer[];
    services: Service[];
    selectedService: Service | null;
}

export default function ServiceForm({ customers, services, selectedService }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceTransactionSchema),
    defaultValues: {
      qty: 1,
      price: 0,
      cost: 0,
      partnerFee: 0,
      paymentMode: 'CASH',
      notes: '',
    },
  });
  
  const formValues = form.watch();

  const profit = useMemo(() => {
    const { qty, price, cost, partnerFee } = formValues;
    if (isNaN(qty) || isNaN(price) || isNaN(cost) || isNaN(partnerFee)) return 0;
    return qty * (price - cost - partnerFee);
  }, [formValues]);

  useEffect(() => {
    if (selectedService) {
      form.reset({
        ...form.getValues(),
        serviceCode: selectedService.code,
        price: selectedService.defaultPrice,
        cost: selectedService.defaultCost,
        partnerFee: selectedService.defaultPartnerFee,
        qty: 1,
      });
    }
  }, [selectedService, form]);

  const handleServiceChange = (serviceCode: string) => {
    const service = services.find(s => s.code === serviceCode);
    if (service) {
         form.reset({
            ...form.getValues(),
            serviceCode: service.code,
            price: service.defaultPrice,
            cost: service.defaultCost,
            partnerFee: service.defaultPartnerFee,
            qty: 1,
        });
    }
  }

  async function onSubmit(data: ServiceFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
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
      form.reset({
        ...form.getValues(),
        customerId: '',
        notes: '',
        qty: 1,
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  const showPartnerFee = useMemo(() => {
    const service = services.find(s => s.code === formValues.serviceCode);
    return service?.category === 'BANKING';
  }, [formValues.serviceCode, services]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
          control={form.control}
          name="serviceCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select onValueChange={(value) => { field.onChange(value); handleServiceChange(value); }} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.code} value={service.code}>{service.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer (Optional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="">Anonymous / Walk-in</SelectItem>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>{customer.name} - {customer.mobileNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
                control={form.control}
                name="qty"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Price (Charge)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            {showPartnerFee && (
                <FormField
                    control={form.control}
                    name="partnerFee"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Partner Fee</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}
        </div>

        <FormField
          control={form.control}
          name="paymentMode"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Payment Mode</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="CASH" /></FormControl>
                    <FormLabel className="font-normal">Cash</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="UPI" /></FormControl>
                    <FormLabel className="font-normal">UPI</FormLabel>
                  </FormItem>
                   <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="BANK" /></FormControl>
                    <FormLabel className="font-normal">Bank</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any specific details about this transaction..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="font-semibold text-lg">Estimated Profit:</span>
            <span className="font-bold text-xl text-green-600 flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {profit.toFixed(2)}
            </span>
        </div>
        
        <Button type="submit" disabled={isSubmitting || !formValues.serviceCode} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Log Transaction'}
        </Button>
      </form>
    </Form>
  );
}
