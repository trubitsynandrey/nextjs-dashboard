'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { deleteExpenseType, DeleteExpenseTypeState } from '@/app/lib/actions/expense-types';
import { useTranslations } from 'next-intl';

export function CreateExpenseType() {
  const tExpenseTypes = useTranslations('ExpenseTypes');

  return (
    <Link
      href="/type-of-expenses/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">{tExpenseTypes('create')}</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateExpenseType({ id }: { id: string }) {
  return (
    <Link
      href={`/type-of-expenses/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteExpenseType({ id, name }: { id: string; name: string }) {
  const tCommon = useTranslations('Common');
  const tExpenseTypes = useTranslations('ExpenseTypes');
  const tErrors = useTranslations('Errors');

  const deleteExpenseTypeWithId = deleteExpenseType.bind(null, id);
  const initialState: DeleteExpenseTypeState = { message: null };
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(async (prevState) => {
    const result = await deleteExpenseTypeWithId(prevState);
    if (!result.message) {
      setIsOpen(false);
    }
    return result;
  }, initialState);

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
              {tExpenseTypes('deleteConfirmTitle')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {tExpenseTypes('deleteConfirmBody', { name })}
            </p>
            {state.message ? (
              <p className="mt-4 text-sm text-red-500">{tErrors(state.message)}</p>
            ) : null}
            <form
              action={formAction}
              className="mt-6 flex justify-end gap-3"
            >
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
