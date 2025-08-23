import { getTransactions } from '@/lib/data';
import PendingWorkClient from './_components/pending-work-client';

export default async function PendingWorkPage() {
    const pendingTransactions = await getTransactions('PENDING');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Pending Work</h1>
                <p className="text-lg text-muted-foreground">
                    Total Pending: <span className="font-bold text-red-500">₹{
                        pendingTransactions.reduce((sum, tx) => sum + tx.pendingAmount, 0).toFixed(2)
                    }</span>
                </p>
            </div>
            <PendingWorkClient transactions={pendingTransactions} />
        </div>
    );
}
