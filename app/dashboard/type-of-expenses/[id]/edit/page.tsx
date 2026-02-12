import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import ExpenseTypeForm from '@/app/ui/type-of-expenses/form';
import { fetchExpenseTypeById } from '@/app/lib/data/expense-types';
import { updateExpenseType } from '@/app/lib/actions/expense-types';

export const metadata: Metadata = {
  title: 'Edit Expense Type',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const expenseType = await fetchExpenseTypeById(id);

  if (!expenseType) {
    notFound();
  }

  const updateExpenseTypeWithId = updateExpenseType.bind(null, expenseType.id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Expense Types', href: '/dashboard/type-of-expenses' },
          {
            label: 'Edit Expense Type',
            href: `/dashboard/type-of-expenses/${id}/edit`,
            active: true,
          },
        ]}
      />
      <ExpenseTypeForm
        action={updateExpenseTypeWithId}
        submitLabel="Save Changes"
        cancelHref="/dashboard/type-of-expenses"
        initialData={expenseType}
      />
    </main>
  );
}
