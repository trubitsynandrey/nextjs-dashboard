import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import ExpenseForm from '@/app/ui/expenses/form';
import { createExpense } from '@/app/lib/actions/expenses';
import { fetchExpenseTypeOptions } from '@/app/lib/data/expense-types';

export const metadata: Metadata = {
  title: 'Create Expense',
};

export default async function Page() {
  const expenseTypes = await fetchExpenseTypeOptions();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Expenses', href: '/dashboard/expenses' },
          {
            label: 'Create Expense',
            href: '/dashboard/expenses/create',
            active: true,
          },
        ]}
      />
      <ExpenseForm
        action={createExpense}
        expenseTypes={expenseTypes}
        submitLabel="Create Expense"
        cancelHref="/dashboard/expenses"
      />
    </main>
  );
}
