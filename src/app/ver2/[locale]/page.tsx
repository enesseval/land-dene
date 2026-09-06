import { setRequestLocale } from 'next-intl/server';
import { ComingSoonProvider } from '@/components/ComingSoon';
import V2Nav from '@/components/v2/V2Nav';
import V2Hero from '@/components/v2/V2Hero';
import V2Manifesto from '@/components/v2/V2Manifesto';
import V2Features from '@/components/v2/V2Features';
import V2Evening from '@/components/v2/V2Evening';
import V2Widgets from '@/components/v2/V2Widgets';
import V2Completion from '@/components/v2/V2Completion';
import V2Footer from '@/components/v2/V2Footer';

export default async function Ver2Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonProvider>
      <div className="grain" aria-hidden="true" />
      <V2Nav />
      <main>
        <V2Hero />
        <V2Manifesto />
        <V2Features />
        <V2Evening />
        <V2Widgets />
        <V2Completion />
      </main>
      <V2Footer />
    </ComingSoonProvider>
  );
}
