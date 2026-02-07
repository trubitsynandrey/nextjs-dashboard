import { fetchMonthlyExpenseLimits } from '@/app/lib/data/expenses';

const formatRub = (amount: number) =>
  amount.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  });

export default async function ExpenseLimits() {
  const limits = await fetchMonthlyExpenseLimits();

  if (!limits.length) {
    return null;
  }

  return (
    <div className="mt-6 rounded-xl bg-gray-50 p-4 shadow-sm">
      <h2 className="text-sm font-medium text-gray-700">Monthly Limits</h2>
      <div className="mt-4 grid gap-4">
        {limits.map((limit) => {
          const percent = Math.min(100, Math.round((limit.spent / limit.limit) * 100));
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
