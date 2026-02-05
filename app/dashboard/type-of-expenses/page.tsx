import { Suspense } from 'react';
import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import ExpenseTypesTable from '@/app/ui/type-of-expenses/table';
import { CreateExpenseType } from '@/app/ui/type-of-expenses/buttons';
import ExpenseTypesTableSkeleton from '@/app/ui/type-of-expenses/skeleton';

export const metadata: Metadata = {
  title: 'Expense Types',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Expense Types</h1>
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
