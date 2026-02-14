'use server';

import { cookies } from 'next/headers';

import { defaultLocale, localeCookieName, locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';

const localeSet = new Set<Locale>(locales);

export async function setLocale(formData: FormData) {
  const value = formData.get('locale');
  const locale = typeof value === 'string' && localeSet.has(value as Locale)
    ? (value as Locale)
    : defaultLocale;

  (await cookies()).set(localeCookieName, locale, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });
}
