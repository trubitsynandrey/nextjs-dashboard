import { fetchMonthlyExpenseLimits } from '@/app/lib/data/expenses';
import ExpenseLimitsClient from '@/app/ui/expenses/limits-client';
import { ExpenseWithType } from '@/app/lib/definitions';

export default async function ExpenseLimits({
  monthStart,
  monthEnd,
  expenses,
}: {
  monthStart: string;
  monthEnd: string;
  expenses: ExpenseWithType[];
}) {
  const limits = await fetchMonthlyExpenseLimits(monthStart, monthEnd);

  if (!limits.length) {
    return null;
  }

  return <ExpenseLimitsClient limits={limits} expenses={expenses} />;
}
