import { Button } from '@/components/ui/button';
import { FadeDown } from '@/components/utils/animations';

export default function CallUs() {
  return (
    <section className="my-32 scroll-m-20" id="call-us">
      <FadeDown className="cont flex flex-col items-center space-y-12">
        <h3 className="text-center text-3xl font-medium xs:text-4xl sm:text-5xl">
          <div className="flex items-center justify-center md:space-x-7">
            <span className="hidden h-0.5 w-28 rounded-full bg-gradient-to-l from-brand-darker/80 md:inline lg:w-40" />
            <span>
              Need more{' '}
              <span className="bg-gradient-to-br from-brand/80 to-brand bg-clip-text text-transparent">
                Clarity?
              </span>
            </span>
            <span className="hidden h-0.5 w-28 rounded-full bg-gradient-to-r from-brand-darker/80 md:inline lg:w-40" />
          </div>
          <span className="mt-2 block">Get in touch!</span>
        </h3>

        <a href="tel:+9779820256741">
          <Button variant="moving-border" className="text-base">
            Call Us
          </Button>
        </a>
      </FadeDown>
    </section>
  );
}
