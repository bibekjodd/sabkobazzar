import Benefits from '@/components/sections/home/benefits';
import CallUs from '@/components/sections/home/call-us';
import Faqs from '@/components/sections/home/faqs';
import Hero from '@/components/sections/home/hero';
import HowItWorks from '@/components/sections/home/how-it-works';
import Testimonials from '@/components/sections/home/testimonials';
import LiveIndicator from '@/components/utils/live-indicator';

export default function page() {
  return (
    <>
      <LiveIndicator />
      <main className="text-indigo-200">
        <Hero />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <Faqs />
        <CallUs />
      </main>
    </>
  );
}
