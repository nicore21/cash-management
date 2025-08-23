import { getCashTransactions, getCashTransactionStats } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Scale } from 'lucide-react';
import CashTransactionList from './_components/cash-transaction-list';

export default async function CashDwPage() {
    const transactions = await getCashTransactions();
    const stats = await getCashTransactionStats();
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Cash Deposit & Withdrawal</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today’s Deposit</CardTitle>
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalDeposit.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today’s Withdrawal</CardTitle>
                        <ArrowUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalWithdrawal.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                        <Scale className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         <div className={`text-2xl font-bold ${stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{stats.netBalance.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <CashTransactionList transactions={transactions} />
        </div>
    );
}
