'use client';

import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

const LABELS: Record<string, string> = {
  tr: 'TR',
  en: 'EN',
  es: 'ES',
  de: 'DE',
  fr: 'FR',
  ar: 'AR',
  ru: 'RU',
  ja: 'JA',
  pt: 'PT',
  it: 'IT',
};

/**
 * v2 locale switch — plain links because the v2 tree lives outside the
 * localized [locale] segment and next-intl's Link would rebuild the wrong
 * path from here.
 */
export default function V2LocaleSwitch() {
  const locale = useLocale();

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-line bg-surface p-1 text-[12.5px] font-medium">
      {routing.locales.map((l) => (
        <a
          key={l}
          href={l === routing.defaultLocale ? '/ver2' : `/ver2/${l}`}
          className={`rounded-full px-2 py-1 uppercase tracking-wide transition-colors ${
            locale === l ? 'bg-ember-soft text-ember' : 'text-faint hover:text-muted'
          }`}
        >
          {LABELS[l] ?? l}
        </a>
      ))}
    </div>
  );
}
