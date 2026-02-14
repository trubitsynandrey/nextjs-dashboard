import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

import { defaultLocale, localeCookieName } from './config';
import { detectLocaleFromHeader, isLocale } from './locale';

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get(localeCookieName)?.value;
  const headerLocale = detectLocaleFromHeader((await headers()).get('accept-language'));

  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : headerLocale ?? defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
