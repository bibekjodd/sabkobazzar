import Benefits from '@/components/sections/benefits';
import CallUs from '@/components/sections/call-us';
import Faqs from '@/components/sections/faqs';
import Hero from '@/components/sections/hero';
import HowItWorks from '@/components/sections/how-it-works';
import Testimonials from '@/components/sections/testimonials';

export default function page() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <Faqs />
      <CallUs />
    </main>
  );
}
