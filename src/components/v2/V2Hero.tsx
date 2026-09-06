'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import { StaticRing, buildStates } from '../Ring';
import { AppStoreButton } from '../ComingSoon';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/**
 * Variation 2 hero — a ring built in depth layers. Ghost arcs sit behind,
 * the real ring floats in front, and the ember head rides the fill line.
 * Everything parallaxes apart on scroll, so the ring feels spatial.
 */
export default function V2Hero() {
  const t = useTranslations('v2.hero');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Depth layers pull apart at different speeds as you scroll past.
  const yGhost = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const yRing = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yCore = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const scaleRing = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacityScene = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Measured ring side — never wider than its column.
  const compRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState(400);
  useEffect(() => {
    const el = compRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.floor(entry.contentRect.width);
      setSide(Math.max(240, Math.min(400, w)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const states = buildStates(14, 6, { joker: 3, today: 6 });
  const ghostStates = buildStates(14, 0);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div
        style={{ opacity: opacityScene }}
        className="mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-20 pt-28 lg:grid-cols-2 lg:gap-4 lg:pt-24"
      >
        {/* Copy — solid plane, floats on top */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ y: yCopy }}
          className="relative z-20"
        >
          <motion.p
            variants={item}
            className="mb-5 font-display text-[13px] font-bold uppercase tracking-[0.18em] text-ember"
          >
            {t('eyebrow')}
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display text-[clamp(34px,8vw,62px)] font-semibold leading-[1.06] tracking-[-0.02em]"
          >
            {t('titleA')}
            <br />
            <span className="text-faint">{t('titleB')}</span>
            <br />
            <span className="text-ember">{t('titleAccent')}</span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-md text-[16px] leading-relaxed text-muted sm:text-[17px]"
          >
            {t('sub')}
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <AppStoreButton size="lg" label={t('primaryCta')} />
            <span className="text-[13px] text-faint">{t('meta')}</span>
          </motion.div>
        </motion.div>

        {/* Depth composition */}
        <div
          ref={compRef}
          className="relative z-10 mx-auto w-full max-w-[440px] lg:max-w-none"
        >
          <div className="relative mx-auto" style={{ width: side, height: side }}>
            {/* Ghost layer — full empty ring, far back, counter-rotating */}
            <motion.div
              style={{ y: yGhost }}
              className="absolute inset-[-8%] opacity-[0.22]"
              aria-hidden="true"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 120, ease: 'linear' }}
                className="h-full w-full"
              >
                <StaticRing
                  states={ghostStates}
                  size={side * 1.16}
                  stroke={Math.max(8, side * 0.028)}
                  gap={5}
                  pulse={false}
                  className="h-full w-full"
                />
              </motion.div>
            </motion.div>

            {/* Middle glow */}
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-ember/10 blur-3xl" />

            {/* Real ring */}
            <motion.div
              style={{ y: yRing, scale: scaleRing }}
              className="absolute inset-0"
            >
              <StaticRing
                states={states}
                size={side}
                stroke={Math.max(11, side * 0.042)}
                gap={3}
                staggerIn
                className="h-full w-full drop-shadow-[0_0_70px_rgba(255,107,71,0.16)]"
              />
            </motion.div>

            {/* Core readout — highest plane, opposite parallax */}
            <motion.div
              style={{ y: yCore }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
                className="tabular font-display text-[clamp(30px,7vw,52px)] font-bold tracking-[-0.02em]"
              >
                7/14
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.7 }}
                className="mt-1 text-[13px] text-faint sm:text-[15px]"
              >
                {t('dayLabel')}
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
