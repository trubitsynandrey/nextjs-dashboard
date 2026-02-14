import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import ExpenseForm from '@/app/ui/expenses/form';
import { fetchExpenseById } from '@/app/lib/data/expenses';
import { fetchExpenseTypeOptions } from '@/app/lib/data/expense-types';
import { updateExpense } from '@/app/lib/actions/expenses';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const tExpenses = await getTranslations('Expenses');
  return { title: tExpenses('edit') };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const tCommon = await getTranslations('Common');
  const tExpenses = await getTranslations('Expenses');
  const params = await props.params;
  const id = params.id;
  const [expense, expenseTypes] = await Promise.all([
    fetchExpenseById(id),
    fetchExpenseTypeOptions(),
  ]);

  if (!expense) {
    notFound();
  }

  const updateExpenseWithId = updateExpense.bind(null, expense.id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: tExpenses('title'), href: '/expenses' },
          {
            label: tExpenses('edit'),
            href: `/expenses/${id}/edit`,
            active: true,
          },
        ]}
      />
      <ExpenseForm
        action={updateExpenseWithId}
        expenseTypes={expenseTypes}
        initialData={expense}
        submitLabel={tCommon('saveChanges')}
        cancelHref="/expenses"
      />
    </main>
  );
}
