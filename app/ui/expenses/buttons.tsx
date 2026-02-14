'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { deleteExpense, DeleteExpenseState } from '@/app/lib/actions/expenses';
import { useTranslations } from 'next-intl';

export function CreateExpense() {
  const tExpenses = useTranslations('Expenses');

  return (
    <Link
      href="/expenses/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">{tExpenses('create')}</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateExpense({ id }: { id: string }) {
  return (
    <Link
      href={`/expenses/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteExpense({ id }: { id: string }) {
  const tCommon = useTranslations('Common');
  const tExpenses = useTranslations('Expenses');
  const tErrors = useTranslations('Errors');

  const deleteExpenseWithId = deleteExpense.bind(null, id);
  const initialState: DeleteExpenseState = { message: null };
  const [state, formAction] = useActionState(async (prevState) => {
    const result = await deleteExpenseWithId(prevState);
    if (!result.message) {
      setIsOpen(false);
    }
    return result;
  }, initialState);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <span className="sr-only">{tCommon('delete')}</span>
        <TrashIcon className="w-5" />
      </button>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">
              {tExpenses('deleteConfirmTitle')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {tExpenses('deleteConfirmBody')}
            </p>
            {state.message ? (
              <p className="mt-4 text-sm text-red-500">{tErrors(state.message)}</p>
            ) : null}
            <form action={formAction} className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                {tCommon('cancel')}
              </button>
              <button
                type="submit"
                className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                {tCommon('delete')}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
