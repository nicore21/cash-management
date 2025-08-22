import { getCustomers } from '@/lib/data';
import CustomerList from './_components/customer-list';

export default async function CustomersPage() {
  const customers = await getCustomers();
  return <CustomerList customers={customers} />;
}
