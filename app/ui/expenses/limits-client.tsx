'use client';

import { useMemo, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { formatDateToLocal } from '@/app/lib/utils';
import { ExpenseWithType } from '@/app/lib/definitions';

type LimitRow = {
  expense_type_id: string;
  name: string;
  color: string;
  limit: number;
  spent: number;
};

const formatRub = (amount: number) =>
  amount.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  });

export default function ExpenseLimitsClient({
  limits,
  expenses,
}: {
  limits: LimitRow[];
  expenses: ExpenseWithType[];
}) {
  const [isOpen, setIsOpen] = useState(true);
  const expensesByType = useMemo(() => {
    const map = new Map<string, ExpenseWithType[]>();
    for (const expense of expenses) {
      if (expense.is_income) {
        continue;
      }
      const list = map.get(expense.expense_type_id);
      if (list) {
        list.push(expense);
      } else {
        map.set(expense.expense_type_id, [expense]);
      }
    }
    return map;
  }, [expenses]);

  return (
    <div className="mt-6 rounded-xl bg-gray-50 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">Monthly Limits</h2>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-full p-1 text-gray-500 transition-transform duration-200 hover:text-gray-700"
          aria-label={isOpen ? 'Collapse monthly limits' : 'Expand monthly limits'}
        >
          <ChevronDownIcon className={`h-4 w-4 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {isOpen ? (
        <div className="mt-4 grid gap-4">
          {limits.map((limit) => {
            const percent =
              limit.limit > 0
                ? Math.min(100, Math.round((limit.spent / limit.limit) * 100))
                : 0;
            const limitExpenses = expensesByType.get(limit.expense_type_id) ?? [];
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
                    aria-label={`${limit.name} ${percent}% of monthly limit`}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">{percent}% used</div>
                <details className="mt-3 rounded-md border border-gray-100 bg-gray-50/60 px-3 py-2">
                  <summary className="cursor-pointer select-none text-xs font-medium text-gray-600">
                    {limitExpenses.length
                      ? `Show expenses (${limitExpenses.length})`
                      : 'No expenses yet'}
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
                              {formatDateToLocal(expense.spent_at)}
                            </div>
                            <div className="truncate text-gray-600">
                              {expense.note || 'No note'}
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
      ) : null}
    </div>
  );
}
