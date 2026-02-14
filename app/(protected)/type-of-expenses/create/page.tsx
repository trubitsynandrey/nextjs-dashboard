import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import ExpenseTypeForm from '@/app/ui/type-of-expenses/form';
import { createExpenseType } from '@/app/lib/actions/expense-types';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const tExpenseTypes = await getTranslations('ExpenseTypes');
  return { title: tExpenseTypes('create') };
}

export default async function Page() {
  const tExpenseTypes = await getTranslations('ExpenseTypes');

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: tExpenseTypes('title'), href: '/type-of-expenses' },
          {
            label: tExpenseTypes('create'),
            href: '/type-of-expenses/create',
            active: true,
          },
        ]}
      />
      <ExpenseTypeForm
        action={createExpenseType}
        submitLabel={tExpenseTypes('create')}
        cancelHref="/type-of-expenses"
      />
    </main>
  );
}
