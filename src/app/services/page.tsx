import { getCustomers, getServices } from '@/lib/data';
import BillingDashboard from './_components/billing-dashboard';

export default async function ServicesPage() {
    const customers = await getCustomers();
    const services = await getServices();
    
    return (
        <BillingDashboard customers={customers} services={services} />
    );
}
