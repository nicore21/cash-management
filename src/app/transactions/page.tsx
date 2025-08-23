import { getTransactions } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { IndianRupee, ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function TransactionsPage() {
    const transactions = await getTransactions();

    const cashTransactionStats = transactions.reduce((acc, tx) => {
        if (tx.cashTransactionType === 'DEPOSIT') {
            acc.totalDeposit += tx.cashTransactionAmount || 0;
        } else if (tx.cashTransactionType === 'WITHDRAWAL') {
            acc.totalWithdrawal += tx.cashTransactionAmount || 0;
        }
        return acc;
    }, { totalDeposit: 0, totalWithdrawal: 0 });
    
    const netBalance = cashTransactionStats.totalDeposit - cashTransactionStats.totalWithdrawal;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">All Transactions</h1>
            
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                        <ArrowDown className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{cashTransactionStats.totalDeposit.toFixed(2)}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
                        <ArrowUp className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{cashTransactionStats.totalWithdrawal.toFixed(2)}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{netBalance.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Service / Transaction</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="text-right">Amount / Qty</TableHead>
                            <TableHead className="text-right">Charge / Price</TableHead>
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
                                    <TableCell className="font-medium">
                                        {tx.serviceName}
                                        {tx.cashTransactionType && (
                                            <span className={`text-xs ml-2 font-normal ${tx.cashTransactionType === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                ({tx.cashTransactionType})
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{tx.customerName || 'Walk-in'}</TableCell>
                                    <TableCell className="text-right font-mono">
                                      {tx.cashTransactionAmount ? `₹${tx.cashTransactionAmount.toFixed(2)}` : tx.qty}
                                    </TableCell>
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
