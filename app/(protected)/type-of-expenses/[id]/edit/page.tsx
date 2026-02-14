import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import ExpenseTypeForm from '@/app/ui/type-of-expenses/form';
import { fetchExpenseTypeById } from '@/app/lib/data/expense-types';
import { updateExpenseType } from '@/app/lib/actions/expense-types';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const tExpenseTypes = await getTranslations('ExpenseTypes');
  return { title: tExpenseTypes('edit') };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const tCommon = await getTranslations('Common');
  const tExpenseTypes = await getTranslations('ExpenseTypes');
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
          { label: tExpenseTypes('title'), href: '/type-of-expenses' },
          {
            label: tExpenseTypes('edit'),
            href: `/type-of-expenses/${id}/edit`,
            active: true,
          },
        ]}
      />
      <ExpenseTypeForm
        action={updateExpenseTypeWithId}
        submitLabel={tCommon('saveChanges')}
        cancelHref="/type-of-expenses"
        initialData={expenseType}
      />
    </main>
  );
}
