'use client';

import { useEffect, useState } from 'react';

const GLYPHS = 'abcdefghjkmnpqrstuvwxyz#*<>/·';

/**
 * Resolves `text` character by character from random glyphs — the "decoder"
 * effect. Settled characters never scramble again; spaces pass through.
 * Loops while `active` stays true with a pause between passes.
 */
export function useScramble(text: string, active: boolean, speed = 30): string {
  const [out, setOut] = useState('');

  useEffect(() => {
    if (!active) return undefined;

    let frame: ReturnType<typeof setInterval>;
    let pass = 0;
    let i = 0;
    let cancelled = false;

    const run = () => {
      frame = setInterval(() => {
        i += 1;
        const settled = text.slice(0, i);
        const rest = text
          .slice(i)
          .split('')
          .map((ch) => (ch === ' ' || ch === '\n' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('');
        setOut(settled + rest);
        if (i >= text.length) {
          clearInterval(frame);
          pass += 1;
          if (!cancelled) {
            // Hold the resolved line, then scramble once more — like the
            // promise is being re-forged.
            setTimeout(run, 3400 + pass * 300);
          }
        }
      }, speed);
    };

    i = 0;
    run();

    return () => {
      cancelled = true;
      clearInterval(frame);
    };
  }, [text, active, speed]);

  return out;
}
