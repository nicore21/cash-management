import { getTransactions } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

function TransactionTypeBadge({ type }: { type: 'service' | 'withdrawal' | 'deposit' }) {
    switch (type) {
        case 'service':
            return <Badge variant="secondary">Service</Badge>;
        case 'withdrawal':
            return <Badge variant="destructive">Withdrawal</Badge>;
        case 'deposit':
            return <Badge className="bg-green-500 hover:bg-green-600 text-white">Deposit</Badge>;
        default:
            return <Badge variant="outline">Unknown</Badge>;
    }
}

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
                            <TableHead>Customer</TableHead>
                            <TableHead>Service/Transaction</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Charge</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length > 0 ? (
                            transactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>{format(new Date(tx.createdAt), 'dd MMM yyyy, hh:mm a')}</TableCell>
                                    <TableCell>{tx.customerName}</TableCell>
                                    <TableCell className="font-medium">{tx.serviceName}</TableCell>
                                    <TableCell><TransactionTypeBadge type={tx.type} /></TableCell>
                                    <TableCell className="text-right font-mono">
                                        {tx.amount ? `₹${tx.amount.toFixed(2)}` : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">₹{tx.chargeAmount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">No transactions found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
