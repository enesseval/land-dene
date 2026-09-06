'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useScramble } from './useScramble';

/**
 * A line that scrambles itself into place every time it re-enters the
 * viewport. The signature "decoding" beat of variation 2.
 */
export default function WordScramble({
  text,
  className = '',
  speed = 30,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(inView);
  }, [inView]);

  const out = useScramble(text, active, speed);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out || '\u00A0'}</span>
    </span>
  );
}
