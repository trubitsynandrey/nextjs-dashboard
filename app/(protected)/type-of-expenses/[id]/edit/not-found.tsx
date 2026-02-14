import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const tNotFound = await getTranslations('NotFound');
  const tCommon = await getTranslations('Common');

  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">{tNotFound('title')}</h2>
      <p>{tNotFound('expenseType')}</p>
      <Link
        href="/type-of-expenses"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        {tCommon('goBack')}
      </Link>
    </main>
  );
}
