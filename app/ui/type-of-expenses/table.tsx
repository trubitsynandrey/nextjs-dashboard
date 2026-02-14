import { fetchExpenseTypes } from '@/app/lib/data/expense-types';
import { DeleteExpenseType, UpdateExpenseType } from '@/app/ui/type-of-expenses/buttons';
import { getTranslations } from 'next-intl/server';

export default async function ExpenseTypesTable() {
  const tCommon = await getTranslations('Common');
  const tExpenseTypes = await getTranslations('ExpenseTypes');
  const expenseTypes = await fetchExpenseTypes();

  if (!expenseTypes.length) {
    return (
      <div className="mt-6 rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-600">
        {tExpenseTypes('table.noItems')}
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {expenseTypes.map((expenseType) => (
              <div
                key={expenseType.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {expenseType.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {expenseType.description || tExpenseTypes('table.noDescription')}
                    </p>
                  </div>
                  <span
                    className="h-4 w-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: expenseType.color }}
                    aria-label={tExpenseTypes('table.colorLabel', { color: expenseType.color })}
                  />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <p className="text-sm text-gray-500">
                    {tExpenseTypes('table.limit', { value: expenseType.limit_month_spent ?? '—' })}
                  </p>
                  <div className="flex justify-end gap-2">
                    <UpdateExpenseType id={expenseType.id} />
                    <DeleteExpenseType id={expenseType.id} name={expenseType.name} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  {tExpenseTypes('table.name')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  {tExpenseTypes('table.color')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  {tExpenseTypes('table.description')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  {tExpenseTypes('table.monthlyLimit')}
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">{tCommon('actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {expenseTypes.map((expenseType) => (
                <tr
                  key={expenseType.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {expenseType.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span
                      className="inline-flex h-5 w-5 rounded-full border border-gray-200"
                      style={{ backgroundColor: expenseType.color }}
                      aria-label={tExpenseTypes('table.colorLabel', { color: expenseType.color })}
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                    {expenseType.description || tExpenseTypes('table.noDescription')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                    {expenseType.limit_month_spent ?? '—'}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateExpenseType id={expenseType.id} />
                      <DeleteExpenseType id={expenseType.id} name={expenseType.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
