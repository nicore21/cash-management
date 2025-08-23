'use client';

import { useState, useMemo } from 'react';
import type { CashTransaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CashTransactionForm from './cash-transaction-form';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export default function CashTransactionList({ transactions: initialTransactions }: { transactions: CashTransaction[] }) {
  const [transactions, setTransactions] = useState<CashTransaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.mobileNumber.includes(searchTerm)
      );
    }

    if (date) {
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);

        filtered = filtered.filter(t => {
            const transactionDate = new Date(t.createdAt);
            return transactionDate >= selectedDate && transactionDate < nextDay;
        });
    }

    return filtered;
  }, [transactions, searchTerm, date]);
  
  const handleTransactionAdded = (newTransaction: CashTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    setIsFormOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex gap-4 flex-1 flex-wrap">
          <Input
            placeholder="Search by name or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Filter by date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {date && <Button variant="ghost" onClick={() => setDate(undefined)}>Clear Date</Button>}
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add Cash Transaction</DialogTitle>
            </DialogHeader>
            <CashTransactionForm onTransactionAdded={handleTransactionAdded} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(tx.createdAt), 'dd/MM/yy hh:mm a')}
                  </TableCell>
                  <TableCell>
                      <div className="font-medium">{tx.customerName}</div>
                      <div className="text-xs text-muted-foreground">{tx.mobileNumber}</div>
                  </TableCell>
                  <TableCell>{tx.bankName}</TableCell>
                  <TableCell>
                    <Badge variant={tx.type === 'DEPOSIT' ? 'secondary' : 'outline'} className={tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">₹{tx.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
