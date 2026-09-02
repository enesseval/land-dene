'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import { StaticRing, buildStates } from './Ring';
import { AppStoreButton } from './ComingSoon';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/** Card floating around the hero ring: parallax on scroll + endless drift. */
function Float({
  className,
  delay = 0,
  parallax,
  children,
}: {
  className?: string;
  delay?: number;
  parallax?: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div style={{ y: parallax }} className={`absolute ${className ?? ''}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.95 + delay, duration: 0.6, ease: EASE }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 5.5,
            ease: 'easeInOut',
            delay,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function AvatarsCard() {
  const t = useTranslations('hero');
  return (
    <div className="flex items-center rounded-xl border border-line bg-surface px-3.5 py-2.5 shadow-xl">
      <div className="flex">
        {['EK', 'AY', 'ZD'].map((ini, i) => (
          <span
            key={ini}
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface font-display text-[9px] font-semibold text-muted ${
              i % 2 ? 'bg-line' : 'bg-elevated'
            } ${i ? '-ml-1.5' : ''}`}
          >
            {ini}
          </span>
        ))}
      </div>
      <span className="tabular ml-2 text-[12px] text-muted">{t('cardDone')}</span>
    </div>
  );
}

function StakeCard() {
  const t = useTranslations('hero');
  return (
    <div className="rounded-xl bg-ember-soft px-3.5 py-2.5 text-[13px] shadow-xl">
      🎯 {t('stake')}
    </div>
  );
}

function BubbleCard() {
  const t = useTranslations('hero');
  return (
    <div className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[12.5px] text-faint shadow-xl">
      {t('bubbleDone')} <span className="text-ember">✓</span>
    </div>
  );
}

export default function Hero() {
  const t = useTranslations('hero');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Ring composition: measure available width so the art can never push the
  // page sideways; the SVG gets exactly `side` px.
  const compRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState(380);
  useEffect(() => {
    const el = compRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.floor(entry.contentRect.width);
      setSide(Math.max(230, Math.min(380, w)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // On scroll away: copy rises, the ring sinks, shrinks and rotates.
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const yRing = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const scaleRing = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const rotateRing = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  // Each floating card drifts at its own speed.
  const yA = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yC = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yD = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const states = buildStates(14, 6, { joker: 3, today: 6 });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div
        style={{ opacity: opacityHero }}
        className="mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-28 sm:pt-32 lg:grid-cols-2 lg:gap-8 lg:pb-24"
      >
        {/* Copy */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ y: yCopy }}
          className="relative z-10"
        >
          <motion.p
            variants={item}
            className="mb-5 font-display text-[13px] font-bold uppercase tracking-[0.18em] text-ember"
          >
            {t('eyebrow')}
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display text-[clamp(34px,8.5vw,60px)] font-semibold leading-[1.1] tracking-[-0.02em]"
          >
            {t('titleA')}
            <br />
            {t('titleB')}
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
            <a
              href="#how"
              className="inline-flex h-14 items-center rounded-full border border-line px-8 text-[17px] font-medium text-fg transition-colors hover:border-faint"
            >
              {t('secondaryCta')}
            </a>
          </motion.div>
          <motion.p variants={item} className="mt-6 text-[13px] text-faint">
            {t('meta')}
          </motion.p>
        </motion.div>

        {/* Ring composition — measured, never wider than its column */}
        <motion.div
          ref={compRef}
          style={{ y: yRing, scale: scaleRing, rotate: rotateRing }}
          className="relative z-0 w-full max-w-[420px] justify-self-center lg:max-w-none"
        >
          <div className="fit-box" style={{ width: side, height: side }}>
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-ember/10 blur-3xl" />
            <StaticRing
              states={states}
              size={side}
              stroke={Math.max(10, side * 0.042)}
              gap={3}
              staggerIn
              className="drop-shadow-[0_0_60px_rgba(255,107,71,0.15)]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="tabular font-display text-[clamp(28px,7vw,48px)] font-bold tracking-[-0.02em]">
                7/14
              </span>
              <span className="mt-1 text-[14px] text-faint sm:text-[15px]">
                {t('dayLabel')}
              </span>
            </div>

            {/* Floating cards only where there is room around the ring */}
            <Float className="-left-24 top-6 hidden sm:block xl:-left-28" parallax={yA} delay={0}>
              <div className="w-[180px] -rotate-3 rounded-2xl border border-line bg-surface p-4 shadow-xl xl:w-[196px]">
                <p className="text-[12px] text-muted">{t('cardTitle')}</p>
                <p className="mt-1 text-[14.5px] font-medium leading-snug">
                  {t('cardAction')}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-ember" />
                  <span className="text-[12px] text-faint">{t('cardDone')}</span>
                </div>
              </div>
            </Float>

            <Float className="-right-6 top-2 hidden sm:block md:-right-16 lg:-right-20" parallax={yB} delay={0.6}>
              <div className="rotate-2">
                <AvatarsCard />
              </div>
            </Float>

            <Float className="-right-4 bottom-12 hidden sm:block md:-right-14 lg:-right-24" parallax={yC} delay={1.1}>
              <div className="rotate-3">
                <StakeCard />
              </div>
            </Float>

            <Float className="-left-4 bottom-2 hidden sm:block md:-left-12 lg:-left-20" parallax={yD} delay={1.6}>
              <div className="rotate-2">
                <BubbleCard />
              </div>
            </Float>
          </div>

          {/* On phones the cards drop below the ring as a small orbit strip */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6, ease: EASE }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:hidden"
          >
            <AvatarsCard />
            <StakeCard />
            <BubbleCard />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
