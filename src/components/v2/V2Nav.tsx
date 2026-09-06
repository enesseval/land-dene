'use client';

import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RingMark } from '../Ring';
import { AppStoreButton } from '../ComingSoon';
import V2LocaleSwitch from './V2LocaleSwitch';
import { Link } from '@/i18n/navigation';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function V2Nav() {
  const t = useTranslations('nav');
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-line/70 bg-abyss/85 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/ver2" className="flex items-center gap-2.5">
          <RingMark size={26} />
          <span className="font-display text-[17px] font-semibold tracking-[-0.01em]">
            halkora
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <V2LocaleSwitch />
          <AppStoreButton label={t('download')} className="hidden sm:inline-flex" />
        </div>
      </div>
      <motion.div style={{ scaleX: scrollYProgress }} className="h-[2px] origin-left bg-ember" />
    </motion.header>
  );
}
