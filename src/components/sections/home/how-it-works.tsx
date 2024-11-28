import { dummyUserImage } from '@/lib/constants';
import { Asterisk, CircleCheckIcon, Clock4, PartyPopper, Signpost, Stars } from 'lucide-react';
import { FadeDown, FadeUp } from '../../utils/animations';
import Avatar from '../../utils/avatar';

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="scroll-m-16">
      <section className="relative overflow-hidden text-sm md:py-12">
        <div className="absolute left-0 top-0 -z-10 size-96 rounded-full bg-purple-900/15 blur-3xl" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-950/10" />

        <div className="absolute inset-0 -z-20 flex flex-wrap overflow-hidden px-10">
          {new Array(500).fill('nothing').map((_, i) => (
            <div key={i} className="size-16 border border-violet-900/5" />
          ))}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background" />
        </div>

        <div className="cont grid lg:grid-cols-2">
          <FadeUp className="relative h-full overflow-hidden rounded-lg lg:mr-5 xl:mr-10">
            <div className="pb-10 xs:px-2">
              <h2 className="mb-2 flex items-center space-x-1 bg-gradient-to-b from-violet-400 to-purple-900 bg-clip-text text-lg font-medium text-transparent">
                <Asterisk className="size-8 text-violet-800/80" />
                <span>How it works</span>
              </h2>
              <h3 className="text-3xl font-medium sm:text-4xl">
                Register and place the highest bid to win
              </h3>
              <p className="mt-5 text-base text-indigo-200/75">
                At SabkoBazzar, you can participate in exciting auctions for your favorite products.
                Simply browse available items, place your bid, and track the auction in real-time.
                If you're the highest bidder when the auction ends, the item is yours!
              </p>
            </div>
          </FadeUp>

          <FadeUp className="relative flex flex-col space-y-2.5 overflow-hidden rounded-3xl px-6 pb-8 lg:ml-5 xl:ml-10">
            <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-violet-500/20 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-violet-500/5 [mask-image:linear-gradient(to_top,black,transparent)]" />

            <div className="absolute left-0 top-0 size-20 rounded-full bg-violet-500/30 blur-3xl filter" />
            <div className="absolute bottom-0 left-0 size-20 rounded-full bg-sky-500/30 blur-3xl filter" />
            <div className="absolute right-0 top-0 size-20 rounded-full bg-violet-500/60 blur-3xl filter" />

            <FadeDown className="space-y-2.5" delay={0.35}>
              <div className="h-6 w-0.5 translate-x-4 rounded-full bg-purple-200/10" />
              <div className="flex items-center space-x-4">
                <div className="grid place-items-center rounded-full bg-emerald-500/15 p-1.5">
                  <CircleCheckIcon className="size-5 fill-emerald-700" />
                </div>
                <span>Register Auction</span>
              </div>
            </FadeDown>

            <FadeDown className="space-y-2.5" delay={0.4}>
              <div className="h-3 w-0.5 translate-x-4 rounded-full bg-purple-200/10" />
              <div className="flex items-center space-x-4">
                <div className="grid place-items-center rounded-full bg-sky-500/15 p-1.5">
                  <Clock4 className="size-5 fill-sky-500" />
                </div>
                <span>Wait for schedule</span>
              </div>
            </FadeDown>

            <FadeDown delay={0.45}>
              <div className="flex">
                <div className="flex items-end space-x-5">
                  <div>
                    <div className="mb-2.5 h-6 w-0.5 translate-x-4 rounded-full bg-purple-200/10" />
                    <Avatar src={dummyUserImage} size="sm" className="translate-x-1" />
                  </div>
                  <div className="relative flex items-center rounded-2xl rounded-bl-none bg-gradient-to-br from-violet-950/20 to-sky-900/30 py-2 pl-4 pr-14">
                    <Signpost className="mr-3 size-5 rotate-12 fill-primary" />
                    <span>Bid 100,000</span>
                  </div>
                </div>
              </div>
            </FadeDown>

            <FadeDown delay={0.5}>
              <div className="flex">
                <div className="flex items-end space-x-5">
                  <div>
                    <div className="mb-2.5 h-6 w-0.5 translate-x-4 rounded-full bg-purple-200/10" />
                    <Avatar
                      src="https://i.ibb.co/1sdhJwp/457798439-122189143832018472-4277241618558647922-n-1-2.jpg"
                      size="sm"
                      className="translate-x-1"
                    />
                  </div>
                  <div className="relative flex items-center rounded-2xl rounded-bl-none bg-gradient-to-br from-violet-950/30 to-sky-900/40 py-2 pl-4 pr-20">
                    <Signpost className="mr-3 size-5 rotate-12 fill-primary" />
                    <span>Bid 120,000</span>
                  </div>
                </div>
              </div>
            </FadeDown>

            <FadeDown delay={0.55}>
              <div className="h-5 w-0.5 translate-x-4 rounded-full bg-purple-200/10" />
              <div className="flex items-end space-x-3">
                <div className="grid place-items-center rounded-full bg-indigo-500/15 p-1.5">
                  <Stars className="size-5 fill-purple-700/70 text-purple-700/70" />
                </div>
                <div className="rounded-full rounded-bl-none bg-gradient-to-br from-indigo-400/10 to-sky-500/15 px-6 py-2">
                  <span>Highest bidder grabs the deal</span>
                  <PartyPopper className="ml-2 inline size-3.5 text-indigo-200" />
                </div>
              </div>
            </FadeDown>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
