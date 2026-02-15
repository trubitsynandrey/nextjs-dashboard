import { getLocale, getTranslations } from 'next-intl/server';
import { setLocale } from '@/app/lib/actions/i18n';

export default async function LanguageSwitcher() {
  const locale = await getLocale();
  const tLocale = await getTranslations('Locale');

  return (
    <div className="relative w-full rounded-md bg-gray-50 p-2 text-xs font-medium text-gray-700 md:px-3">
      <span className="hidden md:block">{tLocale('label')}</span>
      <div className="relative mt-2 md:mt-3">
        <div className="thin-scrollbar flex items-center gap-2 overflow-x-auto pr-6 md:pr-8">
          <form action={setLocale}>
            <input type="hidden" name="locale" value="en" />
            <button
              className={`whitespace-nowrap rounded px-2 py-1 ${locale === 'en' ? 'bg-sky-100 text-blue-700' : 'hover:bg-gray-100'}`}
              type="submit"
            >
              <span className="md:hidden">EN</span>
              <span className="hidden md:inline">{tLocale('english')}</span>
            </button>
          </form>
          <form action={setLocale}>
            <input type="hidden" name="locale" value="ru" />
            <button
              className={`whitespace-nowrap rounded px-2 py-1 ${locale === 'ru' ? 'bg-sky-100 text-blue-700' : 'hover:bg-gray-100'}`}
              type="submit"
            >
              <span className="md:hidden">RU</span>
              <span className="hidden md:inline">{tLocale('russian')}</span>
            </button>
          </form>
          <form action={setLocale}>
            <input type="hidden" name="locale" value="es" />
            <button
              className={`whitespace-nowrap rounded px-2 py-1 ${locale === 'es' ? 'bg-sky-100 text-blue-700' : 'hover:bg-gray-100'}`}
              type="submit"
            >
              <span className="md:hidden">ES</span>
              <span className="hidden md:inline">{tLocale('spanish')}</span>
            </button>
          </form>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-gray-50 to-transparent" />
      </div>
    </div>
  );
}
