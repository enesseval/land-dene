'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { StaticRing, buildStates, type SegState } from '../Ring';

type Feature = {
  key: string;
  states: SegState[];
  from: { x: number; y: number; rotate: number };
};

/**
 * v2's signature: six feature cards scattered across a wide field that fly
 * in from the edges and assemble into a grid as you scroll down. Each card
 * explains one feature in a single line under a live ring.
 */
export default function V2Features() {
  const t = useTranslations('v2.features');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });

  const features: Feature[] = [
    { key: 'checkin', states: buildStates(14, 7, { today: 7 }), from: { x: -420, y: -180, rotate: -18 } },
    { key: 'stake', states: buildStates(14, 6, { joker: 3 }), from: { x: 420, y: -140, rotate: 16 } },
    { key: 'joker', states: buildStates(14, 4, { joker: 4, today: 5 }), from: { x: -460, y: 60, rotate: 14 } },
    { key: 'wave', states: buildStates(14, 5, { today: 5, missed: [4] }), from: { x: 460, y: 100, rotate: -15 } },
    { key: 'social', states: buildStates(14, 7), from: { x: -380, y: 300, rotate: -12 } },
    { key: 'chat', states: buildStates(14, 8), from: { x: 380, y: 340, rotate: 13 } },
  ];

  const assemble = useTransform(scrollYProgress, [0, 0.72], [0, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-28 sm:py-40">
      <div className="mx-auto mb-16 max-w-2xl text-center sm:mb-24">
        <h2 className="font-display text-[clamp(28px,5.5vw,52px)] font-semibold leading-[1.12] tracking-[-0.02em]">
          {t('title')}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted sm:text-[17px]">
          {t('sub')}
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
        {features.map((f) => (
          <FlyingCard key={f.key} feature={f} assemble={assemble} t={t} />
        ))}
      </div>

      <p className="mx-auto mt-14 max-w-md text-center text-[14px] italic leading-relaxed text-faint sm:mt-20">
        {t('note')}
      </p>
    </section>
  );
}

function FlyingCard({
  feature,
  assemble,
  t,
}: {
  feature: Feature;
  assemble: MotionValue<number>;
  t: (k: string) => string;
}) {
  const x = useTransform(assemble, [0, 1], [feature.from.x, 0]);
  const y = useTransform(assemble, [0, 1], [feature.from.y, 0]);
  const rotate = useTransform(assemble, [0, 1], [feature.from.rotate, 0]);
  const opacity = useTransform(assemble, [0, 0.35, 1], [0, 1, 1]);
  const scale = useTransform(assemble, [0, 1], [0.8, 1]);

  return (
    <motion.div
      style={{ x, y, rotate, opacity, scale }}
      className="rounded-3xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="mb-4">
        <StaticRing
          states={feature.states}
          size={56}
          stroke={6}
          gap={4.5}
          pulse={false}
        />
      </div>
      <h3 className="font-display text-[15px] font-semibold tracking-[-0.01em] sm:text-[17px]">
        {t(`${feature.key}.title`)}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted sm:text-[14px]">
        {t(`${feature.key}.copy`)}
      </p>
    </motion.div>
  );
}
