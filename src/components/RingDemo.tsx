'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ScrollRing } from './Ring';

const TOTAL = 14;

/**
 * The centerpiece: a 340vh pinned scene. Scrolling fills the signature ring
 * segment by segment, the day counter ticks up, the check-in button settles
 * into its done state, and milestones swap in a single fixed slot.
 */
export default function RingDemo() {
  const t = useTranslations('ringDemo');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Fill runs on a spring so the segments land with weight, not linearly.
  const rawFill = useTransform(scrollYProgress, [0.08, 0.88], [0, 1]);
  const fill = useSpring(rawFill, { stiffness: 110, damping: 26, mass: 0.6 });

  const dayText = useTransform(fill, (p) => `${Math.round(p * TOTAL)}/${TOTAL}`);
  const glowOpacity = useTransform(fill, [0, 1], [0.1, 0.38]);

  // Check-in → done crossfade right as the last segment lands.
  const doneOpacity = useTransform(fill, [0.975, 0.999], [0, 1]);
  const idleOpacity = useTransform(fill, [0.975, 0.999], [1, 0]);

  const enterScale = useTransform(scrollYProgress, [0, 0.08], [0.9, 1]);
  const enterOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // Measured ring: the SVG gets exactly `side` px, never more than the column.
  const compRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState(380);
  useEffect(() => {
    const el = compRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.floor(entry.contentRect.width);
      const factor = w < 500 ? 0.78 : 0.92;
      setSide(Math.max(210, Math.min(380, Math.floor(w * factor))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const milestones = [
    { title: t('m1.title'), copy: t('m1.copy'), center: 0.26 },
    { title: t('m2.title'), copy: t('m2.copy'), center: 0.58 },
    { title: t('m3.title'), copy: t('m3.copy'), center: 0.84 },
  ];

  return (
    <section ref={ref} className="relative h-[340vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-4 px-6 sm:gap-8 md:grid-cols-2 md:gap-6">
          {/* Copy + milestones */}
          <div className="order-2 md:order-1">
            <div className="mb-4 flex items-center gap-4 sm:mb-6">
              <span className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-faint">
                {t('kicker')}
              </span>
              <div className="h-px w-16 bg-line" />
            </div>
            <h2 className="font-display text-[clamp(24px,4.5vw,48px)] font-semibold leading-[1.15] tracking-[-0.02em]">
              {t('title')}
            </h2>
            <p className="mt-3 hidden max-w-sm text-[15px] leading-relaxed text-muted sm:block">
              {t('copy')}
            </p>

            {/* Fixed slot: milestones crossfade in place, no layout shifts */}
            <div className="relative mt-6 h-[120px] sm:mt-12 sm:h-[150px]">
              {milestones.map((m) => (
                <Milestone
                  key={m.title}
                  progress={scrollYProgress}
                  center={m.center}
                  title={m.title}
                  copy={m.copy}
                />
              ))}
            </div>
          </div>

          {/* Ring */}
          <div className="order-1 md:order-2">
            <div ref={compRef} className="mx-auto w-full max-w-[460px] md:max-w-none">
              <motion.div
                style={{ scale: enterScale, opacity: enterOpacity }}
                className="fit-box"
                // fit-box is sized to the measured ring, centered in the column
              >
                <div style={{ width: side, height: side }} className="relative mx-auto">
                  <motion.div
                    style={{ opacity: glowOpacity }}
                    className="absolute inset-6 rounded-full bg-ember/25 blur-3xl"
                  />
                  <ScrollRing
                    progress={fill}
                    total={TOTAL}
                    size={side}
                    stroke={Math.max(10, side * 0.04)}
                    gap={3}
                    className="relative"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span className="tabular font-display text-[clamp(26px,6vw,44px)] font-bold tracking-[-0.02em]">
                      {dayText}
                    </motion.span>
                    <span className="mt-1 text-[13px] text-faint sm:text-[15px]">
                      {t('dayLabel')}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-2 flex flex-col items-center gap-3 sm:mt-6 sm:gap-4">
              <p className="text-[13.5px] font-medium text-muted sm:text-[15px]">
                {t('action')}
              </p>
              <div className="relative h-11 w-52 sm:h-[52px] sm:w-60">
                <motion.div
                  style={{ opacity: idleOpacity }}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-ember text-[15px] font-bold text-bg shadow-[0_0_48px_rgba(255,107,71,0.25)] sm:text-[17px]"
                >
                  {t('checkin')}
                </motion.div>
                <motion.div
                  style={{ opacity: doneOpacity }}
                  className="absolute inset-0 flex items-center justify-center rounded-full border border-line text-[15px] font-medium text-muted sm:text-[17px]"
                >
                  <span className="mr-2 text-ember">✓</span>
                  {t('done')}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint, fades as soon as the fill starts */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="mb-2 text-[12px] uppercase tracking-[0.2em] text-faint">
            {t('scrollHint')}
          </p>
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className="mx-auto text-faint"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.div>
      </div>
    </section>
  );
}

function Milestone({
  progress,
  center,
  title,
  copy,
}: {
  progress: MotionValue<number>;
  center: number;
  title: string;
  copy: string;
}) {
  const last = center > 0.8;
  const fadeIn = center - 0.09;
  const fadeOut = Math.min(center + 0.2, 1);

  const opacity = useTransform(
    progress,
    last ? [fadeIn, center] : [fadeIn, center, fadeOut - 0.05, fadeOut],
    last ? [0, 1] : [0, 1, 1, 0],
  );
  const yIn = useTransform(progress, [fadeIn, center], [18, 0]);
  const yOut = useTransform(
    progress,
    last ? [0, 1] : [fadeOut - 0.05, fadeOut],
    last ? [0, 0] : [0, -14],
  );

  return (
    <motion.div style={{ opacity, y: yOut }} className="absolute inset-x-0 top-0">
      <motion.div style={{ y: yIn }} className="flex items-start gap-3.5">
        <span className="mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full bg-ember" />
        <div>
          <p className="tabular font-display text-[16px] font-semibold tracking-[-0.01em] sm:text-[17px]">
            {title}
          </p>
          <p className="mt-1 max-w-sm text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {copy}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
