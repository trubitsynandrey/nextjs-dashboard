import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import ExpenseForm from '@/app/ui/expenses/form';
import { createExpense } from '@/app/lib/actions/expenses';
import { fetchExpenseTypeOptions } from '@/app/lib/data/expense-types';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const tExpenses = await getTranslations('Expenses');
  return { title: tExpenses('create') };
}

export default async function Page() {
  const tExpenses = await getTranslations('Expenses');
  const expenseTypes = await fetchExpenseTypeOptions();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: tExpenses('title'), href: '/expenses' },
          {
            label: tExpenses('create'),
            href: '/expenses/create',
            active: true,
          },
        ]}
      />
      <ExpenseForm
        action={createExpense}
        expenseTypes={expenseTypes}
        submitLabel={tExpenses('create')}
        cancelHref="/expenses"
      />
    </main>
  );
}
