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
import { getLocale, getTranslations } from 'next-intl/server';
import { toIntlLocale } from '@/i18n/locale';

export async function generateMetadata(): Promise<Metadata> {
  const tExpenses = await getTranslations('Expenses');
  return { title: tExpenses('title') };
}

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

function monthLabel(date: Date, locale: string) {
  return date.toLocaleString(locale, { month: 'long', year: 'numeric' });
}

export default async function Page(props: {
  searchParams?: Promise<{ month?: string }>;
}) {
  const locale = await getLocale();
  const intlLocale = toIntlLocale(locale);
  const tCommon = await getTranslations('Common');
  const tExpenses = await getTranslations('Expenses');

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
  const formattedMonthlyExpenseTotal = monthlyTotal.toLocaleString(intlLocale, {
    style: 'currency',
    currency: 'RUB',
  });
  const monthlyIncomeTotal = await fetchMonthlyIncomeTotal(monthStart.toISOString(), monthEnd.toISOString());
  const formattedMonthlyIncomeTotal = monthlyIncomeTotal.toLocaleString(intlLocale, {
    style: 'currency',
    currency: 'RUB',
  });
  const expenses = await fetchExpenses(monthStart.toISOString(), monthEnd.toISOString());

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>{tExpenses('title')}</h1>
      <div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <CreateExpense />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            href={`/expenses?month=${prevMonthKey}`}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            {tCommon('prev')}
          </Link>
          <span className="font-medium text-gray-900">
            {monthLabel(monthStart, intlLocale)}
          </span>
          <Link
            href={`/expenses?month=${nextMonthKey}`}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            {tCommon('next')}
          </Link>
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          title={tExpenses('totalExpenses')}
          value={formattedMonthlyExpenseTotal}
          type="expenses"
          rootClassName="h-fit"
        />
        <Card
          title={tExpenses('totalIncome')}
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
