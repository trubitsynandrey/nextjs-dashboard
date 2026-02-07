import { Suspense } from 'react';
import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import ExpensesTable from '@/app/ui/expenses/table';
import { CreateExpense } from '@/app/ui/expenses/buttons';
import ExpensesTableSkeleton from '@/app/ui/expenses/skeleton';
import { Card } from '@/app/ui/dashboard/cards';
import { fetchMonthlyExpenseTotal, fetchMonthlyIncomeTotal } from '@/app/lib/data/expenses';
import ExpenseLimits from '@/app/ui/expenses/limits';

export const metadata: Metadata = {
  title: 'Expenses',
};

export default async function Page() {
  const monthlyTotal = await fetchMonthlyExpenseTotal();
  const formattedMonthlyExpenseTotal = monthlyTotal.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  });
  const monthlyIncomeTotal = await fetchMonthlyIncomeTotal();
  const formattedMonthlyIncomeTotal = monthlyIncomeTotal.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  });

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Expenses</h1>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Expenses (RUB)" value={formattedMonthlyExpenseTotal} type="expenses" />
        <Card title="Total Income (RUB)" value={formattedMonthlyIncomeTotal} type="expenses" />
      </div>
      <ExpenseLimits />
      <div className="mt-4 flex items-center justify-end gap-2 md:mt-8">
        <CreateExpense />
      </div>
      <Suspense fallback={<ExpensesTableSkeleton />}>
        <ExpensesTable />
      </Suspense>
    </div>
  );
}
