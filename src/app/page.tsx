import { getDashboardStats } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Users, Briefcase, ArrowUp, ArrowDown, Scale } from 'lucide-react';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Daily Profit</CardTitle>
                <IndianRupee className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                <div className="text-3xl font-bold text-green-900">₹{stats.dailyProfit.toFixed(2)}</div>
                <p className="text-xs text-green-700">Total service and transaction fee earnings for today</p>
                </CardContent>
            </Card>
            <Card className="bg-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Monthly Profit</CardTitle>
                <IndianRupee className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                <div className="text-3xl font-bold text-green-900">₹{stats.monthlyProfit.toFixed(2)}</div>
                <p className="text-xs text-green-700">Total service and transaction fee earnings this month</p>
                </CardContent>
            </Card>
            <Card className="bg-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Services Today</CardTitle>
                <Briefcase className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                <div className="text-3xl font-bold text-blue-900">+{stats.servicesToday}</div>
                <p className="text-xs text-blue-700">Services & transactions today</p>
                </CardContent>
            </Card>
            <Card className="bg-orange-100 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Total Customers</CardTitle>
                <Users className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                <div className="text-3xl font-bold text-orange-900">{stats.totalCustomers}</div>
                <p className="text-xs text-orange-700">Total customers registered</p>
                </CardContent>
            </Card>
        </div>
        <h2 className="text-2xl font-bold mt-8 mb-4">Today's Cash Flow</h2>
        <div className="grid gap-6 md:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deposit</CardTitle>
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">₹{stats.dailyDeposit.toFixed(2)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Withdrawal</CardTitle>
                <ArrowUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">₹{stats.dailyWithdrawal.toFixed(2)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className={`text-2xl font-bold ${stats.dailyNetCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{stats.dailyNetCash.toFixed(2)}
                </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
