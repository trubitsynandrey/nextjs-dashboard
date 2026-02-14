'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { ExpenseFormAction, ExpenseFormState } from '@/app/lib/actions/expenses';
import { ExpenseTypeOption } from '@/app/lib/definitions';
import { CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

function RubleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 4h6a4 4 0 0 1 0 8H7" />
      <path d="M7 12h6" />
      <path d="M7 12v8" />
      <path d="M7 16h8" />
    </svg>
  );
}

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
    is_income: boolean;
  };
  submitLabel: string;
  cancelHref: string;
}) {
  const tExpenses = useTranslations('Expenses');
  const tCommon = useTranslations('Common');
  const tErrors = useTranslations('Errors');
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
            {tExpenses('form.amount')}
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
              placeholder={tExpenses('form.amountPlaceholder')}
              aria-describedby="amount-error"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <RubleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.amount?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {tErrors(error)}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="expense_type_id" className="mb-2 block text-sm font-medium">
            {tExpenses('form.expenseType')}
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
                {tExpenses('form.selectType')}
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
                {tErrors(error)}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="spent_at" className="mb-2 block text-sm font-medium">
            {tExpenses('form.spentAt')}
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
                {tErrors(error)}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="note" className="mb-2 block text-sm font-medium">
            {tExpenses('form.noteOptional')}
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            defaultValue={initialData?.note ?? ''}
            placeholder={tExpenses('form.notePlaceholder')}
            className="block w-full rounded-md border border-gray-200 p-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="is_income"
            name="is_income"
            type="checkbox"
            defaultChecked={initialData?.is_income ?? false}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2"
          />
          <label htmlFor="is_income" className="text-sm font-medium">
            {tExpenses('form.markIncome')}
          </label>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-4 text-sm text-red-500">{tErrors(state.message)}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={cancelHref}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {tCommon('cancel')}
        </Link>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
