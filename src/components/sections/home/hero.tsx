'use client';

import { ProgressLink } from '@jodd/next-top-loading-bar';
import { Button } from '../../ui/button';
import { FadeDown } from '../../utils/animations';

export default function Hero() {
  return (
    <section className="relative grid min-h-screen place-items-center">
      {graphics}
      <FadeDown className="flex flex-col items-center">
        <div className="relative mb-5 h-fit w-fit overflow-hidden border-b border-purple-500 p-2 uppercase">
          <div className="absolute left-0 top-0 -z-10 aspect-square w-full translate-y-2 rounded-full bg-purple-400/25 blur-md" />
          <p className="text-xs tracking-wider text-purple-500">#1 Reselling Platform</p>
        </div>

        <div className="space-y-3 text-center text-3xl font-semibold xs:text-4xl sm:text-5xl">
          <h3>Your go to Marketplace</h3>
          <h3 className="bg-gradient-to-br from-violet-600 to-fuchsia-800 bg-clip-text pb-3 text-transparent">
            To grab the finest deals
          </h3>
        </div>

        <Button variant="moving-border" className="mt-3">
          <ProgressLink href="/auctions">Explore Auctions</ProgressLink>
        </Button>
      </FadeDown>
    </section>
  );
}

const graphics = (
  <>
    <div className="absolute left-0 top-0 -z-10 flex h-full w-full flex-wrap overflow-hidden">
      {new Array(400).fill('nothing').map((_, i) => (
        <div key={i} className="size-14 border border-l-0 border-t-0 border-purple-700/15" />
      ))}

      <div className="absolute right-0 h-full w-1/2 bg-gradient-to-l from-purple-500/10 blur-3xl filter" />
      <div className="absolute left-0 h-full w-1/2 bg-gradient-to-l from-indigo-500/5 blur-3xl filter" />

      <div className="absolute inset-0 left-0 top-16 size-full bg-gradient-to-b from-background/90 blur-3xl filter" />
      <div className="absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-background/40" />
      <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-background/40" />
      <div className="absolute bottom-0 left-0 h-60 w-full bg-gradient-to-t from-background/40" />

      <div className="absolute left-0 top-10 h-24 w-48 rotate-45 bg-indigo-500/15 blur-3xl filter sm:h-40 sm:w-80 md:h-48 md:w-96 lg:w-[500px]" />
      <div className="absolute right-0 top-10 h-24 w-48 -rotate-45 bg-violet-500/15 blur-3xl filter sm:h-40 sm:w-80 md:h-48 md:w-96 lg:w-[500px]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="size-40 translate-x-10 rounded-full bg-indigo-500/10 blur-3xl filter sm:size-60 lg:size-96" />
        <div className="size-40 -translate-x-10 rounded-full bg-violet-500/10 blur-3xl filter sm:size-60 lg:size-96" />
      </div>
    </div>
  </>
);