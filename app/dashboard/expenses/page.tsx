import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import ExpensesTable from '@/app/ui/expenses/table';
import { CreateExpense } from '@/app/ui/expenses/buttons';
import ExpensesTableSkeleton from '@/app/ui/expenses/skeleton';
import { Card } from '@/app/ui/dashboard/cards';
import { fetchExpenses, fetchMonthlyExpenseTotal, fetchMonthlyIncomeTotal } from '@/app/lib/data/expenses';
import ExpenseLimits from '@/app/ui/expenses/limits';
import ExpenseBreakdownClient from '@/app/ui/expenses/breakdown-client';

export const metadata: Metadata = {
  title: 'Expenses',
};


function parseMonth(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return null;
  }
  const [year, month] = value.split('-').map(Number);
  if (!year || !month || month < 1 || month > 12) {
    return null;
  }
  return { year, month };
}

function buildMonthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function monthLabel(date: Date) {
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export default async function Page(props: {
  searchParams?: Promise<{ month?: string }>;
}) {
  const searchParams = await props.searchParams;
  const parsed = parseMonth(searchParams?.month);
  const now = new Date();
  const baseYear = parsed?.year ?? now.getFullYear();
  const baseMonth = parsed?.month ?? now.getMonth() + 1;
  const monthStart = new Date(Date.UTC(baseYear, baseMonth - 1, 1));
  const monthEnd = new Date(Date.UTC(baseYear, baseMonth, 1));
  const prevMonthDate = new Date(Date.UTC(baseYear, baseMonth - 2, 1));
  const nextMonthDate = new Date(Date.UTC(baseYear, baseMonth, 1));
  const prevMonthKey = buildMonthKey(prevMonthDate.getUTCFullYear(), prevMonthDate.getUTCMonth() + 1);
  const nextMonthKey = buildMonthKey(nextMonthDate.getUTCFullYear(), nextMonthDate.getUTCMonth() + 1);

  const monthlyTotal = await fetchMonthlyExpenseTotal(monthStart.toISOString(), monthEnd.toISOString());
  const formattedMonthlyExpenseTotal = monthlyTotal.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  });
  const monthlyIncomeTotal = await fetchMonthlyIncomeTotal(monthStart.toISOString(), monthEnd.toISOString());
  const formattedMonthlyIncomeTotal = monthlyIncomeTotal.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  });
  const expenses = await fetchExpenses(monthStart.toISOString(), monthEnd.toISOString());

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>Expenses</h1>
      <div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <CreateExpense />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            href={`/dashboard/expenses?month=${prevMonthKey}`}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Prev
          </Link>
          <span className="font-medium text-gray-900">{monthLabel(monthStart)}</span>
          <Link
            href={`/dashboard/expenses?month=${nextMonthKey}`}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Next
          </Link>
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Total Expenses (RUB)"
          value={formattedMonthlyExpenseTotal}
          type="expenses"
          rootClassName="h-fit"
        />
        <Card
          title="Total Income (RUB)"
          value={formattedMonthlyIncomeTotal}
          type="expenses"
          rootClassName="h-fit"
        />
        <ExpenseBreakdownClient expenses={expenses} />
      </div>
      <ExpenseLimits
        monthStart={monthStart.toISOString()}
        monthEnd={monthEnd.toISOString()}
        expenses={expenses}
      />
      <Suspense fallback={<ExpensesTableSkeleton />}>
        <ExpensesTable monthStart={monthStart.toISOString()} monthEnd={monthEnd.toISOString()} />
      </Suspense>
    </div>
  );
}
