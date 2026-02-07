import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import ExpenseForm from '@/app/ui/expenses/form';
import { fetchExpenseById, fetchExpenseTypeOptions } from '@/app/lib/data';
import { updateExpense } from '@/app/lib/actions/expenses';

export const metadata: Metadata = {
  title: 'Edit Expense',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
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
          { label: 'Expenses', href: '/dashboard/expenses' },
          {
            label: 'Edit Expense',
            href: `/dashboard/expenses/${id}/edit`,
            active: true,
          },
        ]}
      />
      <ExpenseForm
        action={updateExpenseWithId}
        expenseTypes={expenseTypes}
        initialData={expense}
        submitLabel="Save Changes"
        cancelHref="/dashboard/expenses"
      />
    </main>
  );
}
