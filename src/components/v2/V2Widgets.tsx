'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { StaticRing, buildStates } from '../Ring';

/**
 * Widgets, told simply: three panels in a row — small, medium, lock screen.
 * Each slides up with a different delay so they read as a set, not a grid.
 */
export default function V2Widgets() {
  const t = useTranslations('v2.widgets');

  return (
    <section className="mx-auto max-w-5xl px-6 py-28 sm:py-40">
      <div className="mx-auto mb-14 max-w-xl text-center sm:mb-20">
        <span className="mb-4 inline-block rounded-xl bg-ember-soft px-3.5 py-2 font-display text-[13px] font-semibold text-ember">
          {t('chip')}
        </span>
        <h2 className="font-display text-[clamp(26px,5vw,46px)] font-semibold leading-[1.15] tracking-[-0.02em]">
          {t('title')}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-[16px]">{t('sub')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {/* Small */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ type: 'spring', bounce: 0.22, duration: 0.85 }}
          className="flex flex-col rounded-3xl border border-line bg-surface p-5"
        >
          <div className="mx-auto my-auto flex w-full max-w-[180px] flex-col gap-3 rounded-2xl border border-line bg-abyss p-4">
            <p className="text-[11px] font-medium leading-tight text-muted">{t('smallName')}</p>
            <div className="relative mx-auto">
              <StaticRing states={buildStates(14, 7, { today: 7 })} size={64} stroke={6} gap={4.5} />
              <span className="tabular absolute inset-0 flex items-center justify-center font-display text-[12px] font-semibold">
                7/14
              </span>
            </div>
            <div className="rounded-full bg-ember py-1.5 text-center text-[11px] font-bold text-bg">
              {t('checkin')}
            </div>
          </div>
          <p className="mt-4 text-center text-[12.5px] text-faint">{t('sLabel')}</p>
        </motion.div>

        {/* Medium */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ type: 'spring', bounce: 0.22, duration: 0.85, delay: 0.12 }}
          className="flex flex-col rounded-3xl border border-line bg-surface p-5"
        >
          <div className="mx-auto my-auto w-full max-w-[220px] rounded-2xl border border-line bg-abyss p-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <StaticRing states={buildStates(21, 10, { joker: 6, today: 10 })} size={64} stroke={7} gap={4} />
                <span className="tabular absolute inset-0 flex items-center justify-center font-display text-[11px] font-semibold">
                  10/21
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold">{t('mediumName')}</p>
                <p className="truncate text-[11.5px] text-muted">{t('mediumAction')}</p>
                <p className="tabular mt-1 text-[10.5px] text-joker">● {t('mediumJoker')}</p>
              </div>
            </div>
            <div className="mt-3 rounded-full bg-ember py-2 text-center text-[11px] font-bold text-bg">
              {t('checkin')}
            </div>
          </div>
          <p className="mt-4 text-center text-[12.5px] text-faint">{t('mLabel')}</p>
        </motion.div>

        {/* Lock screen */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ type: 'spring', bounce: 0.22, duration: 0.85, delay: 0.24 }}
          className="flex flex-col rounded-3xl border border-line bg-surface p-5"
        >
          <div className="mx-auto my-auto flex h-[180px] w-full max-w-[180px] items-center justify-center rounded-2xl border border-line bg-abyss">
            <div className="relative">
              <StaticRing states={buildStates(14, 7)} size={64} stroke={6} gap={5} pulse={false} />
              <span className="tabular absolute inset-0 flex items-center justify-center font-display text-[12px] font-semibold">
                7/14
              </span>
            </div>
          </div>
          <p className="mt-4 text-center text-[12.5px] text-faint">{t('lLabel')}</p>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="mx-auto mt-12 max-w-md text-center text-[14px] italic leading-relaxed text-faint"
      >
        {t('note')}
      </motion.p>
    </section>
  );
}
