import { fetchExpenses } from '@/app/lib/data/expenses';
import { DeleteExpense, UpdateExpense } from '@/app/ui/expenses/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { getLocale, getTranslations } from 'next-intl/server';
import { toIntlLocale } from '@/i18n/locale';

export default async function ExpensesTable({
  monthStart,
  monthEnd,
}: {
  monthStart: string;
  monthEnd: string;
}) {
  const locale = await getLocale();
  const intlLocale = toIntlLocale(locale);
  const tCommon = await getTranslations('Common');
  const tExpenses = await getTranslations('Expenses');
  const formatAmount = (amount: number) =>
    amount.toLocaleString(intlLocale, {
      style: 'currency',
      currency: 'RUB',
    });
  const expenses = await fetchExpenses(monthStart, monthEnd);

  if (!expenses.length) {
    return (
      <div className="mt-6 rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-600">
        {tExpenses('table.noExpenses')}
      </div>
    );
  }

  return (
    <details open className="mt-6 rounded-lg bg-gray-50 p-2 open:shadow-sm">
      <summary className="cursor-pointer select-none rounded-md px-4 py-3 text-sm font-medium text-gray-700">
        {tExpenses('table.summary')}
      </summary>
      <div className="mt-2 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {expenses.map((expense) => (
                <div key={expense.id} className="mb-2 w-full rounded-md bg-white p-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatAmount(expense.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateToLocal(expense.spent_at, intlLocale)}
                      </p>
                    </div>
                    <span
                      className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: expense.expense_type_color }}
                      />
                      {expense.expense_type_name}
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      <span>{expense.note || tCommon('noNote')}</span>
                      <span className={expense.is_income ? 'text-emerald-600' : 'text-rose-600'}>
                        {expense.is_income ? tCommon('income') : tCommon('expense')}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateExpense id={expense.id} />
                      <DeleteExpense id={expense.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    {tExpenses('table.amount')}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {tExpenses('table.type')}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {tExpenses('table.spentAt')}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {tExpenses('table.note')}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {tExpenses('table.category')}
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">{tCommon('actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      {formatAmount(expense.amount)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: expense.expense_type_color }}
                        />
                        {expense.expense_type_name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDateToLocal(expense.spent_at, intlLocale)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                      {expense.note || tCommon('noNote')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${expense.is_income ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {expense.is_income ? tCommon('income') : tCommon('expense')}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateExpense id={expense.id} />
                        <DeleteExpense id={expense.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </details>
  );
}
