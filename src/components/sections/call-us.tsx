import { Button } from '../ui/button';
import { FadeDown } from '../utils/animations';

export default function CallUs() {
  return (
    <section className="my-32 scroll-m-20" id="call-us">
      <FadeDown className="cont flex flex-col items-center space-y-10">
        <h3 className="text-center text-3xl font-medium xs:text-4xl sm:text-5xl">
          <span>
            Need more{' '}
            <span className="bg-gradient-to-br from-violet-600 to-fuchsia-800 bg-clip-text text-transparent">
              clarity?
            </span>
          </span>
          <span className="block">Get in touch!</span>
        </h3>

        <a href="tel:+9779812345678">
          <Button variant="moving-border" className="text-base">
            Call Us
          </Button>
        </a>
      </FadeDown>
    </section>
  );
}
