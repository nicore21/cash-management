import { getCustomers } from '@/lib/data';
import ServiceForm from './_components/service-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ServicesPage() {
    const customers = await getCustomers();
    return (
        <div className="flex justify-center items-start pt-8">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Log New Service or Transaction</CardTitle>
                    <CardDescription>Fill in the details below to record a new transaction for a customer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ServiceForm customers={customers} />
                </CardContent>
            </Card>
        </div>
    );
}
