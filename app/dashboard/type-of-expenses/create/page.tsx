import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import ExpenseTypeForm from '@/app/ui/type-of-expenses/form';
import { createExpenseType } from '@/app/lib/actions';

export const metadata: Metadata = {
  title: 'Create Expense Type',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Expense Types', href: '/dashboard/type-of-expenses' },
          {
            label: 'Create Expense Type',
            href: '/dashboard/type-of-expenses/create',
            active: true,
          },
        ]}
      />
      <ExpenseTypeForm
        action={createExpenseType}
        submitLabel="Create Expense Type"
        cancelHref="/dashboard/type-of-expenses"
      />
    </main>
  );
}
