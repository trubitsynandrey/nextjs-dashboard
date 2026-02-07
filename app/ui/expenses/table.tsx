import { fetchExpenses } from '@/app/lib/data';
import { DeleteExpense, UpdateExpense } from '@/app/ui/expenses/buttons';
import { formatDateToLocal } from '@/app/lib/utils';

const formatAmount = (amount: number) =>
  amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'RUB',
  });

export default async function ExpensesTable() {
  const expenses = await fetchExpenses();

  if (!expenses.length) {
    return (
      <div className="mt-6 rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-600">
        No expenses found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
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
                      {formatDateToLocal(expense.spent_at)}
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
                  <p className="text-sm text-gray-500">
                    {expense.note || 'No note'}
                  </p>
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
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Type
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Spent At
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Note
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
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
                    {formatDateToLocal(expense.spent_at)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                    {expense.note || 'No note'}
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
  );
}
