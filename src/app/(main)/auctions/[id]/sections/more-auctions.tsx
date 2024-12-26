'use client';

import AuctionCard from '@/components/cards/auction-card';
import { useAuctions } from '@/queries/use-auctions';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { ActivityIcon, ChevronRightIcon } from 'lucide-react';

export default function MoreAuctions({ currentAuction }: { currentAuction: Auction }) {
  const { data } = useAuctions({});

  const auctions = data?.filter((auction) => auction.id !== currentAuction.id);

  return (
    <section className="relative z-10 scroll-m-20 pt-16" id="upcoming-auctions">
      <div className="flex justify-between">
        <h3 className="px-2 text-2xl font-medium sm:text-3xl">
          <span>Explore more auctions</span>
          <ActivityIcon className="ml-2 inline size-6 text-brand xs:size-7" />
        </h3>

        <ProgressLink
          href="/auctions"
          className="hidden items-center space-x-2.5 rounded-full border border-indigo-500/5 bg-muted-foreground/5 px-4 py-1.5 text-sm font-medium hover:bg-muted-foreground/10 xs:flex sm:px-5 sm:py-2 sm:text-base"
        >
          <span>See all</span>
          <ChevronRightIcon className="size-4 sm:size-5" />
        </ProgressLink>
      </div>

      <div className="mt-4 flex flex-wrap">
        {auctions?.slice(0, 6).map((auction) => (
          <div key={auction.id} className="mb-7 w-full md:w-1/2 md:p-4 xl:w-1/3">
            <AuctionCard auction={auction} />
          </div>
        ))}
      </div>
    </section>
  );
}
