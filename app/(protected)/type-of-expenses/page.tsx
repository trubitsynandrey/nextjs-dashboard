import { Suspense } from 'react';
import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import ExpenseTypesTable from '@/app/ui/type-of-expenses/table';
import { CreateExpenseType } from '@/app/ui/type-of-expenses/buttons';
import ExpenseTypesTableSkeleton from '@/app/ui/type-of-expenses/skeleton';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const tExpenseTypes = await getTranslations('ExpenseTypes');
  return { title: tExpenseTypes('title') };
}

export default async function Page() {
  const tExpenseTypes = await getTranslations('ExpenseTypes');

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>{tExpenseTypes('title')}</h1>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 md:mt-8">
        <CreateExpenseType />
      </div>
      <Suspense fallback={<ExpenseTypesTableSkeleton />}>
        <ExpenseTypesTable />
      </Suspense>
    </div>
  );
}
