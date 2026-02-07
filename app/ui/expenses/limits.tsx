import { fetchMonthlyExpenseLimits } from '@/app/lib/data/expenses';
import ExpenseLimitsClient from '@/app/ui/expenses/limits-client';

export default async function ExpenseLimits({
  monthStart,
  monthEnd,
}: {
  monthStart: string;
  monthEnd: string;
}) {
  const limits = await fetchMonthlyExpenseLimits(monthStart, monthEnd);

  if (!limits.length) {
    return null;
  }

  return <ExpenseLimitsClient limits={limits} />;
}
