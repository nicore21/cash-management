import { getTransactions } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { IndianRupee } from 'lucide-react';

export default async function TransactionsPage() {
    const transactions = await getTransactions();

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">All Transactions</h1>
            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Cost</TableHead>
                            <TableHead className="text-right">Fee</TableHead>
                            <TableHead className="text-right">Profit</TableHead>
                            <TableHead>Payment</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length > 0 ? (
                            transactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                        {format(new Date(tx.createdAt), 'dd/MM/yy hh:mm a')}
                                    </TableCell>
                                    <TableCell className="font-medium">{tx.serviceName}</TableCell>
                                    <TableCell>{tx.customerName || 'Walk-in'}</TableCell>
                                    <TableCell className="text-center">{tx.qty}</TableCell>
                                    <TableCell className="text-right font-mono">₹{tx.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono text-red-500">₹{tx.cost.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono text-red-500">₹{tx.partnerFee.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono text-green-600 font-bold">₹{tx.profit.toFixed(2)}</TableCell>
                                     <TableCell>
                                        <Badge variant="outline">{tx.paymentMode}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center h-24">No transactions found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
