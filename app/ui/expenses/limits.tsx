import { fetchExpenses, fetchMonthlyExpenseLimits } from '@/app/lib/data/expenses';
import ExpenseLimitsClient from '@/app/ui/expenses/limits-client';

export default async function ExpenseLimits({
  monthStart,
  monthEnd,
}: {
  monthStart: string;
  monthEnd: string;
}) {
  const [limits, expenses] = await Promise.all([
    fetchMonthlyExpenseLimits(monthStart, monthEnd),
    fetchExpenses(monthStart, monthEnd),
  ]);

  if (!limits.length) {
    return null;
  }

  return <ExpenseLimitsClient limits={limits} expenses={expenses} />;
}
