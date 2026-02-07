'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { ExpenseFormAction, ExpenseFormState } from '@/app/lib/actions/expenses';
import { ExpenseTypeOption } from '@/app/lib/definitions';
import { CurrencyDollarIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

function formatDateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function ExpenseForm({
  action,
  expenseTypes,
  initialData,
  submitLabel,
  cancelHref,
}: {
  action: ExpenseFormAction;
  expenseTypes: ExpenseTypeOption[];
  initialData?: {
    amount: number;
    expense_type_id: string;
    spent_at: string;
    note: string | null;
  };
  submitLabel: string;
  cancelHref: string;
}) {
  const initialState: ExpenseFormState = { message: null, errors: {} };
  const [state, formAction] = useActionState(action, initialState);
  const defaultSpentAt = initialData?.spent_at
    ? formatDateTimeLocal(initialData.spent_at)
    : '';

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Amount
          </label>
          <div className="relative">
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={initialData?.amount ?? ''}
              placeholder="Enter amount"
              aria-describedby="amount-error"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.amount?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="expense_type_id" className="mb-2 block text-sm font-medium">
            Expense Type
          </label>
          <div className="relative">
            <select
              id="expense_type_id"
              name="expense_type_id"
              required
              defaultValue={initialData?.expense_type_id ?? ''}
              aria-describedby="expense-type-error"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="" disabled>
                Select a type
              </option>
              {expenseTypes.map((expenseType) => (
                <option key={expenseType.id} value={expenseType.id}>
                  {expenseType.name}
                </option>
              ))}
            </select>
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="expense-type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.expenseTypeId?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="spent_at" className="mb-2 block text-sm font-medium">
            Spent At
          </label>
          <div className="relative">
            <input
              id="spent_at"
              name="spent_at"
              type="datetime-local"
              defaultValue={defaultSpentAt}
              aria-describedby="spent-at-error"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="spent-at-error" aria-live="polite" aria-atomic="true">
            {state.errors?.spentAt?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="note" className="mb-2 block text-sm font-medium">
            Note (optional)
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            defaultValue={initialData?.note ?? ''}
            placeholder="Add a short note"
            className="block w-full rounded-md border border-gray-200 p-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-4 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={cancelHref}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
