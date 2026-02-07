import { fetchMonthlyExpenseLimits } from '@/app/lib/data/expenses';
import ExpenseLimitsClient from '@/app/ui/expenses/limits-client';

export default async function ExpenseLimits() {
  const limits = await fetchMonthlyExpenseLimits();

  if (!limits.length) {
    return null;
  }

  return <ExpenseLimitsClient limits={limits} />;
}
