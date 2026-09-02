'use client';

import { useTranslations } from 'next-intl';
import { StaticRing, buildStates } from './Ring';

/**
 * Two endless strips of example challenges drifting in opposite directions at
 * a constant speed (content duplicated once, track translates -50% and loops).
 */
export default function Marquee() {
  const t = useTranslations('marquee');
  const row1 = t.raw('row1') as string[];
  const row2 = t.raw('row2') as string[];

  return (
    <section className="overflow-hidden border-y border-line/60 py-8" aria-hidden="true">
      <div className="mask-fade-x mb-3">
        <div className="animate-marquee-l flex w-max gap-3 pr-3">
          {[...row1, ...row1].map((label, i) => (
            <Chip key={`a-${i}`} label={label} filled={(i % 8) + 2} />
          ))}
        </div>
      </div>
      <div className="mask-fade-x">
        <div className="animate-marquee-r flex w-max gap-3 pr-3">
          {[...row2, ...row2].map((label, i) => (
            <Chip key={`b-${i}`} label={label} filled={(i % 8) + 2} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Chip({ label, filled }: { label: string; filled: number }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-[14px] text-muted">
      <StaticRing
        states={buildStates(8, filled)}
        size={16}
        stroke={3}
        gap={8}
        pulse={false}
      />
      {label}
    </span>
  );
}
