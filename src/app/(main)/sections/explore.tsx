'use client';

import { Button } from '@/components/ui/button';
import { FadeDown, FadeUp } from '@/components/utils/animations';
import { useWindowSize } from '@/hooks/use-window-size';
import { MILLIS, dummyAuctionBanner } from '@/lib/constants';
import { prefetchAuction } from '@/lib/query-utils';
import { cn, isAuctionPending } from '@/lib/utils';
import { useAuctions } from '@/queries/use-auctions';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChartNoAxesGanttIcon,
  ClockIcon,
  FlameIcon,
  GlobeIcon,
  GlobeLockIcon,
  HistoryIcon,
  RadioIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Explore() {
  const { width } = useWindowSize();
  const { data: auctions, error } = useAuctions();
  const [activeAuction, setActiveAuction] = useState<Auction | null>(null);

  useEffect(() => {
    const selectRandomAuction = () => {
      if (!auctions) return null;
      const randomIndex = Math.floor(Math.random() * auctions.length);
      let randomSelectedAuction = auctions[randomIndex];
      if (randomSelectedAuction?.id === activeAuction?.id)
        randomSelectedAuction = auctions[(randomIndex + 1) % auctions.length];
      return randomSelectedAuction || null;
    };

    if (!activeAuction) setActiveAuction(selectRandomAuction());

    const interval = setInterval(() => {
      setActiveAuction(selectRandomAuction());
    }, 5000);

    return () => clearInterval(interval);
  }, [activeAuction, auctions]);
  if (error) return null;

  const isPending = activeAuction && isAuctionPending(activeAuction);

  return (
    <div
      className={cn('lb:pb-32 relative min-h-[600px] pb-24 pt-10', {
        'overflow-hidden': width < 1024
      })}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-bl from-brand/10 via-transparent blur-3xl" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-tl from-info/10 blur-3xl" />

      <FadeDown className="cont mb-12 mt-6">
        <h3 className="text-center text-3xl font-medium xs:text-4xl sm:text-5xl">
          <div className="flex items-center justify-center md:space-x-7">
            <span className="hidden h-0.5 w-28 rounded-full bg-gradient-to-l from-brand-darker/80 lg:inline lg:w-40 xl:w-48" />
            <span>
              Seeking{' '}
              <span className="bg-gradient-to-br from-brand/80 to-brand bg-clip-text text-transparent">
                {' '}
                Hottest Sales?
              </span>
            </span>
            <span className="hidden h-0.5 w-28 rounded-full bg-gradient-to-r from-brand-darker/80 lg:inline lg:w-40 xl:w-48" />
          </div>
          <span className="mt-2 block">Give it a click!</span>
        </h3>
      </FadeDown>

      <FadeUp>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0 }}
            className="cont relative grid lg:grid-cols-2"
            key={activeAuction?.id}
          >
            <section className="lg:pr-5">
              <div className="relative">
                <img
                  src={activeAuction?.banner || dummyAuctionBanner}
                  alt="banner"
                  className="aspect-video w-full object-cover"
                />

                <div className="absolute left-0 top-0 -z-10 hidden aspect-square w-[55%] scale-125 rounded-full bg-brand/10 blur-3xl lg:block" />
                <div className="absolute right-0 top-0 -z-10 hidden aspect-square w-[55%] scale-125 rounded-full bg-info/15 blur-3xl lg:block" />
              </div>
            </section>

            <section className="mt-12 flex flex-col text-muted-foreground lg:mt-0 lg:pl-5">
              <div className="mb-2 flex items-center space-x-1 bg-gradient-to-b from-brand/80 to-brand bg-clip-text text-lg font-medium text-transparent">
                {isPending ? (
                  <RadioIcon className="size-6 text-brand/80" />
                ) : (
                  <HistoryIcon className="size-5 text-brand/80" />
                )}
                <span>{isPending ? 'Coming Live' : 'Recently completed'}</span>
              </div>

              <h3 className="line-clamp-2 text-3xl font-medium sm:text-4xl">
                {activeAuction?.title || 'Best live auction as sabkobazzar'}
              </h3>

              <div className="mt-2 flex items-center space-x-1.5">
                {activeAuction?.isInviteOnly ? (
                  <>
                    <GlobeLockIcon className="size-4" />
                    <span>Only Invited members can join</span>
                  </>
                ) : (
                  <>
                    <GlobeIcon className="size-4" />
                    <span>Anyone can join</span>
                  </>
                )}
              </div>

              <div className="mb-4 mt-2 flex items-center space-x-1.5">
                <ClockIcon className="size-4" />
                <span>
                  Scheduled for{' '}
                  {dayjs(activeAuction?.startsAt || new Date(Date.now() + MILLIS.MONTH)).format(
                    'MMMM DD, ha'
                  )}
                </span>
              </div>

              <ProgressLink href="/auctions" className="mb-1 mt-auto">
                <Button variant="brand" className="w-full" Icon={FlameIcon}>
                  Explore more Auctions
                </Button>
              </ProgressLink>

              {activeAuction && (
                <ProgressLink
                  href={`/auctions/${activeAuction.id}`}
                  onClick={() => prefetchAuction(activeAuction)}
                  className="w-full"
                >
                  <button className="flex h-9 w-full items-center justify-center space-x-2 rounded-md border border-brand/40 text-sm font-medium hover:bg-brand-darker hover:text-white">
                    <span>See more about Auction</span>
                    <ChartNoAxesGanttIcon className="size-4" />
                  </button>
                </ProgressLink>
              )}
            </section>
          </motion.div>
        </AnimatePresence>
      </FadeUp>
    </div>
  );
}
