'use client';

import { useMemo } from 'react';
import { formatDateToLocal } from '@/app/lib/utils';
import { ExpenseWithType } from '@/app/lib/definitions';
import { groupExpensesByType } from '@/app/ui/expenses/expense-utils';
import { useLocale, useTranslations } from 'next-intl';
import { toIntlLocale } from '@/i18n/locale';

type LimitRow = {
  expense_type_id: string;
  name: string;
  color: string;
  limit: number;
  spent: number;
};

export default function ExpenseLimitsClient({
  limits,
  expenses,
}: {
  limits: LimitRow[];
  expenses: ExpenseWithType[];
}) {
  const locale = useLocale();
  const intlLocale = toIntlLocale(locale);
  const tCommon = useTranslations('Common');
  const tExpenses = useTranslations('Expenses');
  const expensesByType = useMemo(() => groupExpensesByType(expenses), [expenses]);
  const formatRub = (amount: number) =>
    amount.toLocaleString(intlLocale, {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 2,
    });

  return (
    <details
      open
      className="mt-6 rounded-xl bg-gray-50 p-4 shadow-sm open:shadow-sm"
    >
      <summary className="cursor-pointer select-none rounded-md px-2 py-1 text-sm font-medium text-gray-700">
        {tExpenses('limits.title')}
      </summary>
      <div className="mt-4 grid gap-4">
        {limits.map((limit) => {
          const percent =
            limit.limit > 0
              ? Math.min(100, Math.round((limit.spent / limit.limit) * 100))
              : 0;
          const limitExpenses = expensesByType.get(limit.expense_type_id)?.expenses ?? [];
          return (
            <div key={limit.expense_type_id} className="rounded-lg bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: limit.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {limit.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatRub(limit.spent)} / {formatRub(limit.limit)}
                </span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${percent}%`, backgroundColor: limit.color }}
                  aria-label={tExpenses('limits.ariaLabel', { name: limit.name, percent })}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {tExpenses('limits.percentUsed', { percent })}
              </div>
              <details className="mt-3 rounded-md border border-gray-100 bg-gray-50/60 px-3 py-2">
                <summary className="cursor-pointer select-none text-xs font-medium text-gray-600">
                  {limitExpenses.length
                    ? tExpenses('limits.showExpenses', { count: limitExpenses.length })
                    : tExpenses('limits.noExpensesYet')}
                </summary>
                {limitExpenses.length ? (
                  <div className="mt-3 space-y-2">
                    {limitExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-start justify-between gap-4 rounded-md bg-white px-3 py-2 text-xs text-gray-700 shadow-sm"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">
                            {formatRub(expense.amount)}
                          </div>
                          <div className="text-gray-500">
                            {formatDateToLocal(expense.spent_at, intlLocale)}
                          </div>
                          <div className="truncate text-gray-600">
                            {expense.note || tCommon('noNote')}
                          </div>
                        </div>
                        <div className="shrink-0 text-right text-gray-500">
                          {expense.expense_type_name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </details>
            </div>
          );
        })}
      </div>
    </details>
  );
}
