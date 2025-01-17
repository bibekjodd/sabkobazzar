import Benefits from './sections/benefits';
import CallUs from './sections/call-us';
import Explore from './sections/explore';
import Faqs from './sections/faqs';
import Hero from './sections/hero';
import HowItWorks from './sections/how-it-works';
import LiveIndicator from './sections/live-indicator';
import Testimonials from './sections/testimonials';

export default function page() {
  return (
    <>
      <LiveIndicator />
      <main className="overflow-hidden">
        <Hero />
        <Explore />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <Faqs />
        <CallUs />
      </main>
    </>
  );
}
