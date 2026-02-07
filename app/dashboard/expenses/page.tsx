import { Suspense } from 'react';
import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import ExpensesTable from '@/app/ui/expenses/table';
import { CreateExpense } from '@/app/ui/expenses/buttons';
import ExpensesTableSkeleton from '@/app/ui/expenses/skeleton';

export const metadata: Metadata = {
  title: 'Expenses',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Expenses</h1>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 md:mt-8">
        <CreateExpense />
      </div>
      <Suspense fallback={<ExpensesTableSkeleton />}>
        <ExpensesTable />
      </Suspense>
    </div>
  );
}
