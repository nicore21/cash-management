'use client';

import { useState, useMemo } from 'react';
import type { ServiceTransaction } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { updateTransactionStatusAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Printer, Search } from 'lucide-react';

export default function PendingWorkClient({ transactions: initialTransactions }: { transactions: ServiceTransaction[] }) {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    const filteredTransactions = useMemo(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        if (!lowercasedFilter) return transactions;
    
        return transactions.filter(item => {
          return (
            item.customerName?.toLowerCase().includes(lowercasedFilter) ||
            item.serviceName.toLowerCase().includes(lowercasedFilter) ||
            item.customerMobile?.includes(lowercasedFilter)
          );
        });
      }, [searchTerm, transactions]);

    const handleMarkAsPaid = async (transactionId: string) => {
        const result = await updateTransactionStatusAction(transactionId, 'PAID');
        if (result.success) {
            setTransactions(prev => prev.filter(t => t.id !== transactionId));
            toast({ title: 'Success', description: 'Transaction marked as paid.' });
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-4">
             <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-section, #print-section * {
                        visibility: visible;
                    }
                    #print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none;
                    }
                }
            `}</style>
            
            <div className="flex justify-between items-center gap-4 no-print">
                 <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by customer name, mobile, or service..."
                        className="pl-8 sm:w-full md:w-1/3 lg:w-1/3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={handlePrint} variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Report
                </Button>
            </div>

            <div className="border rounded-lg bg-card" id="print-section">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead className="text-right">Total Charge</TableHead>
                            <TableHead className="text-right">Amount Paid</TableHead>
                            <TableHead className="text-right font-bold text-red-500">Pending</TableHead>
                            <TableHead className="text-center no-print">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {format(new Date(tx.createdAt), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        <div>{tx.customerName || 'Walk-in'}</div>
                                        {tx.customerMobile && <div className="text-xs text-muted-foreground">{tx.customerMobile}</div>}
                                    </TableCell>
                                    <TableCell className="font-medium">{tx.serviceName}</TableCell>
                                    <TableCell className="text-right font-mono">₹{tx.totalCharge.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono">₹{tx.amountPaid.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-red-500">₹{tx.pendingAmount.toFixed(2)}</TableCell>
                                    <TableCell className="text-center no-print">
                                        <Button
                                            size="sm"
                                            onClick={() => handleMarkAsPaid(tx.id)}
                                        >
                                            Mark as Paid
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">No pending work found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
