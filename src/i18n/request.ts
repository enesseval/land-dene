import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const base = (await import(`../../messages/${locale}.json`)).default;
  // Languages beyond tr/en don't ship v2 copy yet — fall back to Turkish
  // for the v2 namespace so every route stays renderable.
  const fallback = (await import('../../messages/tr.json')).default;

  return {
    locale,
    messages: { ...fallback, ...base },
  };
});
