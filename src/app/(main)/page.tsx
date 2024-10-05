import Benefits from '@/components/sections/benefits';
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
    </main>
  );
}
