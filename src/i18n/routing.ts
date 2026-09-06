import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['tr', 'en', 'es', 'de', 'fr', 'ar', 'ru', 'ja', 'pt', 'it'],
  defaultLocale: 'tr',
  // Turkish is served at "/", other languages at "/{locale}"
  localePrefix: 'as-needed',
});
