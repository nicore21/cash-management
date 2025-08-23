'use client';

import { useState } from 'react';
import type { ServiceTransaction } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { updateTransactionStatusAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Printer } from 'lucide-react';

export default function PendingWorkClient({ transactions: initialTransactions }: { transactions: ServiceTransaction[] }) {
    const [transactions, setTransactions] = useState(initialTransactions);
    const { toast } = useToast();

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

            <div className="flex justify-end no-print">
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
                        {transactions.length > 0 ? (
                            transactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {format(new Date(tx.createdAt), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell>{tx.customerName || 'Walk-in'}</TableCell>
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
