import { defaultLocale, locales, type Locale } from './config';

const localeSet = new Set<string>(locales);

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && localeSet.has(value);
}

export function detectLocaleFromHeader(
  header: string | null,
  fallback: Locale = defaultLocale,
): Locale {
  if (!header) return fallback;

  const ranges = header.split(',').map((part) => part.trim());
  for (const range of ranges) {
    const tag = range.split(';')[0]?.toLowerCase();
    if (!tag) continue;
    if (isLocale(tag)) return tag;

    const primary = tag.split('-')[0];
    if (isLocale(primary)) return primary;
  }

  return fallback;
}

export function toIntlLocale(value: string | null | undefined): string {
  if (value === 'ru') return 'ru-RU';
  return 'en-US';
}
