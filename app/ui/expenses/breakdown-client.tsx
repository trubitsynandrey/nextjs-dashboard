'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { ExpenseWithType } from '@/app/lib/definitions';
import { groupExpensesByType } from '@/app/ui/expenses/expense-utils';

const formatRub = (amount: number) =>
  amount.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  });

export default function ExpenseBreakdownClient({
  expenses,
}: {
  expenses: ExpenseWithType[];
}) {
  const items = Array.from(groupExpensesByType(expenses).values()).sort(
    (a, b) => b.spent - a.spent,
  );
  const total = items.reduce((sum, item) => sum + item.spent, 0);
  const topItem = items[0];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex items-center px-4 py-3">
        <h3 className="text-sm font-medium text-gray-700">Expense Share</h3>
      </div>
      <div className="rounded-xl bg-white px-4 py-4">
        {total > 0 ? (
          <div className="grid gap-4">
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={items}
                    dataKey="spent"
                    nameKey="name"
                    innerRadius={0}
                    outerRadius={70}
                    stroke="transparent"
                  >
                    {items.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-2 text-xs text-gray-600">
              {items.map((item) => {
                const percent = total ? Math.round((item.spent / total) * 100) : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-gray-500">{percent}%</span>
                  </div>
                );
              })}
            </div>
            {topItem ? (
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                <span className="font-medium text-gray-900">Top category:</span>{' '}
                {topItem.name} ({Math.round((topItem.spent / total) * 100)}%) ·{' '}
                {formatRub(topItem.spent)}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-gray-500">
            No expenses yet for this month.
          </div>
        )}
      </div>
    </div>
  );
}
