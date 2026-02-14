import { getTranslations } from 'next-intl/server';

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export default async function ExpensesTableSkeleton() {
  const tCommon = await getTranslations('Common');
  const tExpenses = await getTranslations('Expenses');

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`${shimmer} relative mb-2 w-full rounded-md bg-white p-4`}
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 h-4 w-24 rounded bg-gray-100" />
                    <div className="h-3 w-28 rounded bg-gray-100" />
                  </div>
                  <div className="h-5 w-20 rounded-full bg-gray-100" />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="h-3 w-32 rounded bg-gray-100" />
                  <div className="flex gap-2">
                    <div className="h-9 w-9 rounded bg-gray-100" />
                    <div className="h-9 w-9 rounded bg-gray-100" />
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
              {Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index}
                  className={`${shimmer} relative w-full border-b py-3 text-sm last-of-type:border-none`}
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="h-4 w-20 rounded bg-gray-100" />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="h-5 w-24 rounded-full bg-gray-100" />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="h-4 w-24 rounded bg-gray-100" />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="h-4 w-32 rounded bg-gray-100" />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="h-4 w-16 rounded bg-gray-100" />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <div className="h-9 w-9 rounded bg-gray-100" />
                      <div className="h-9 w-9 rounded bg-gray-100" />
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
