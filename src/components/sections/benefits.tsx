import {
  Asterisk,
  AsteriskIcon,
  DollarSignIcon,
  LucideLayers2,
  ShieldCheckIcon,
  Signpost
} from 'lucide-react';

export default function Benefits() {
  return (
    <section id="benefits" className="cont mt-16 md:mt-24">
      <div className="flex items-center justify-center">
        <AsteriskIcon className="size-8 text-violet-800/80" />
        <span className="bg-gradient-to-b from-violet-400 to-purple-900 bg-clip-text text-base font-medium text-transparent">
          Benefits
        </span>
      </div>
      <h3 className="mt-3 flex flex-col items-center justify-center text-center text-3xl font-medium xs:text-4xl sm:text-5xl">
        <span>Unlock maximum potential</span>
        <span className="mt-2">with our platform</span>
      </h3>

      <div className="mt-10 flex flex-wrap justify-center">
        <div className="w-full pb-10 md:w-1/2 md:p-5 lg:w-1/3">
          <div className="relative flex flex-col items-center overflow-hidden rounded-3xl p-6 text-violet-300">
            {graphics}
            <LucideLayers2 className="size-8" />
            <h3 className="mt-3 text-center text-2xl font-semibold">
              <span>Unlimited Product</span>
              <span className="block">Listings</span>
            </h3>
          </div>
        </div>

        <div className="w-full pb-10 md:w-1/2 md:p-5 lg:w-1/3">
          <div className="relative flex flex-col items-center overflow-hidden rounded-3xl p-6 text-violet-300">
            {graphics}
            <DollarSignIcon className="size-8" />
            <h3 className="mt-3 text-center text-2xl font-semibold">
              <span>Ultimate Resale</span>
              <span className="block">Pricing</span>
            </h3>
          </div>
        </div>

        <div className="w-full pb-10 md:w-1/2 md:p-5 lg:w-1/3">
          <div className="relative flex flex-col items-center overflow-hidden rounded-3xl p-6 text-violet-300">
            {graphics}
            <Signpost className="size-8 rotate-12 fill-violet-300" />
            <h3 className="mt-3 text-center text-2xl font-semibold">
              <span>Realtime Auction</span>
              <span className="block">Biddings</span>
            </h3>
          </div>
        </div>
      </div>

      <div className="text-indigo-300 md:p-5">
        <div className="relative flex w-full items-center space-x-5 overflow-hidden rounded-3xl px-3 py-6">
          <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-violet-500/25 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-violet-500/5 [mask-image:linear-gradient(to_top,black,transparent)]" />

          <div className="absolute left-0 top-0 -z-10 size-20 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute right-0 top-0 -z-10 size-20 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute inset-0 -z-10 scale-110 bg-gradient-to-b from-indigo-200/5" />

          <div>
            <div className="flex items-center">
              <Asterisk className="size-12" />
              <h3 className="text-3xl font-medium">Sabkobazzar</h3>
            </div>
            <p className="text-base xs:w-9/12 sm:w-10/12 md:text-xl">
              Manages auctions with strict policies to maintain fairness on the platform
            </p>
          </div>

          <div className="relative hidden w-1/3 flex-col items-center space-y-3 sm:flex">
            <ShieldCheckIcon className="size-12 xs:size-20" />
            <span className="hidden lg:block">Most reliable platform</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const graphics = (
  <>
    <div className="absolute inset-0 -z-10 flex flex-wrap overflow-hidden">
      {new Array(120).fill('nothing').map((_, i) => (
        <div key={i} className="size-8 border border-violet-900/10" />
      ))}
    </div>
    <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-violet-500/25 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
    <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-violet-500/5 [mask-image:linear-gradient(to_top,black,transparent)]" />
    <div className="absolute right-0 top-0 -z-10 size-24 rounded-full bg-purple-500/30 blur-3xl filter" />
    <div className="absolute left-0 top-0 -z-10 size-24 rounded-full bg-indigo-500/40 blur-3xl filter" />
  </>
);