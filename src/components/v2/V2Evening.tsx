'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RingMark } from '../Ring';

/**
 * The evening story, told as one pinned scene. The whole screen dims to
 * night; the reminder banner slides in first, then the wave. Nothing else
 * on screen — this is the emotional beat of the page.
 */
export default function V2Evening() {
  const t = useTranslations('v2.evening');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Night falls as the scene pins, lifts at the very end.
  const night = useTransform(scrollYProgress, [0, 0.2, 0.82, 1], [0, 1, 1, 0]);
  const moon = useTransform(scrollYProgress, [0.08, 0.35, 0.85], [0, 1, 0]);

  // First banner drops early, second lands after the narrative line.
  const rIn = useTransform(scrollYProgress, [0.14, 0.3], [0, 1]);
  const rY = useTransform(scrollYProgress, [0.14, 0.3], [-70, 0]);
  const wIn = useTransform(scrollYProgress, [0.5, 0.66], [0, 1]);
  const wY = useTransform(scrollYProgress, [0.5, 0.66], [-70, 0]);

  const lineOpacity = useTransform(scrollYProgress, [0.3, 0.45, 0.68, 0.8], [0, 1, 1, 0]);
  const closeOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);
  const closeY = useTransform(scrollYProgress, [0.7, 0.85], [30, 0]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {/* night atmosphere */}
        <motion.div style={{ opacity: night }} className="absolute inset-0 bg-abyss" aria-hidden="true" />
        <motion.div
          style={{ opacity: moon }}
          className="absolute right-[10%] top-[14%] h-44 w-44 rounded-full bg-ember/15 blur-3xl sm:h-60 sm:w-60"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-8 px-6">
          <motion.p
            style={{ opacity: rIn }}
            className="mb-2 self-start rounded-xl bg-ember-soft px-3.5 py-2 font-display text-[13px] font-semibold text-ember"
          >
            {t('chip')}
          </motion.p>

          {/* reminder banner */}
          <motion.div style={{ opacity: rIn, y: rY }} className="self-stretch">
            <div className="rounded-2xl border border-line bg-surface/85 p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
                <RingMark size={16} />
                <span>halkora</span>
                <span className="ml-auto normal-case tracking-normal">{t('rTime')}</span>
              </div>
              <p className="mt-2.5 text-[15px] font-semibold">{t('rTitle')}</p>
              <p className="mt-0.5 text-[13.5px] text-muted">{t('rBody')}</p>
            </div>
          </motion.div>

          {/* narrative line */}
          <motion.p
            style={{ opacity: lineOpacity }}
            className="font-display text-[clamp(20px,4.5vw,30px)] font-semibold leading-[1.25] tracking-[-0.02em] text-muted"
          >
            {t('line')}
          </motion.p>

          {/* wave banner */}
          <motion.div style={{ opacity: wIn, y: wY }} className="self-stretch">
            <div className="rounded-2xl border border-line bg-surface/85 p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
                <RingMark size={16} />
                <span>halkora</span>
                <span className="ml-auto normal-case tracking-normal">{t('wTime')}</span>
              </div>
              <p className="mt-2.5 text-[15px] font-semibold">{t('wTitle')}</p>
              <p className="mt-0.5 text-[13.5px] text-muted">{t('wBody')}</p>
            </div>
          </motion.div>

          {/* closing */}
          <motion.p
            style={{ opacity: closeOpacity, y: closeY }}
            className="font-display text-[clamp(22px,5vw,34px)] font-semibold leading-[1.2] tracking-[-0.02em] text-ember"
          >
            {t('closing')}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
