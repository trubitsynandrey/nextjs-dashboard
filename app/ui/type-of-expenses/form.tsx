'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { ExpenseTypeFormAction, ExpenseTypeFormState } from '@/app/lib/actions/expense-types';

export default function ExpenseTypeForm({
  action,
  initialData,
  submitLabel,
  cancelHref,
}: {
  action: ExpenseTypeFormAction;
  initialData?: {
    name: string;
    color: string;
    description: string | null;
    limit_month_spent: number | null;
  };
  submitLabel: string;
  cancelHref: string;
}) {
  const initialState: ExpenseTypeFormState = { message: null, errors: {} };
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={initialData?.name ?? ''}
            placeholder="Enter expense type name"
            aria-describedby="name-error"
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="color" className="mb-2 block text-sm font-medium">
            Color
          </label>
          <div className="flex items-center gap-3">
            <input
              id="color"
              name="color"
              type="color"
              required
              defaultValue={initialData?.color}
              aria-describedby="color-error"
              className="h-10 w-12 cursor-pointer rounded-md border border-gray-200 bg-white"
            />
          </div>
          <div id="color-error" aria-live="polite" aria-atomic="true">
            {state.errors?.color?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={initialData?.description ?? ''}
            placeholder="Add a short description"
            className="block w-full rounded-md border border-gray-200 p-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="limit_month_spent" className="mb-2 block text-sm font-medium">
            Monthly Spend Limit (optional)
          </label>
          <input
            id="limit_month_spent"
            name="limit_month_spent"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialData?.limit_month_spent ?? ''}
            placeholder="Enter monthly limit"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
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
