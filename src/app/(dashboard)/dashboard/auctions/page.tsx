'use client';
import AuctionCard from '@/components/cards/auction-card';
import SelectAuctionProductDialog from '@/components/dialogs/select-auction-product-dialog';
import { poppins } from '@/lib/fonts';
import { useProfile } from '@/queries/use-profile';
import { useUpcomingAuctions } from '@/queries/use-upcoming-auctions';
import { ActivityIcon, ArrowDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
  const [showButton, setShowButton] = useState(true);
  const { data: profile } = useProfile();
  const { data: upcomingAuctions } = useUpcomingAuctions({
    ownerId: profile?.id!,
    productId: null
  });

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setShowButton(!!upcomingAuctions?.pages.at(0)?.at(0) && window.scrollY < 80);
    });
  }, [upcomingAuctions]);

  return (
    <main className="p-4">
      <section className="grid min-h-[calc(100vh-96px)] place-items-center py-10">
        {graphics}

        {showButton && (
          <Link
            href="/dashboard/auctions#upcoming-auctions"
            className="fixed bottom-8 right-8 z-30 rounded-full border-2 border-purple-950 p-3 text-purple-900 lg:bottom-16 lg:right-16"
          >
            <ArrowDown />
          </Link>
        )}

        <div className="flex flex-col items-center">
          <div className="relative mb-5 h-fit w-fit overflow-hidden border-b border-rose-500 p-2 uppercase">
            <div className="absolute left-0 top-0 -z-10 aspect-square w-full translate-y-2 rounded-full bg-rose-400/25 blur-md" />
            <p className="text-xs tracking-wider text-rose-500">#1 Reselling Platform</p>
          </div>
          <p
            className={`${poppins.className} mb-7 flex flex-col items-center space-y-5 text-center text-3xl font-medium xs:text-5xl`}
          >
            <span>Drop your product</span>
            <span className="bg-gradient-to-r from-sky-700 to-purple-500 bg-clip-text text-transparent">
              To the Auction now
            </span>
          </p>

          <SelectAuctionProductDialog>
            <button className="relative flex items-center rounded-lg bg-gradient-to-b from-sky-950/20 to-sky-900/80 px-6 py-2 shadow-[0_0_8px_#075985] transition-all duration-500 hover:shadow-[0_0_12px_#075985]">
              <span className="mr-2">Register for an auction</span>
              <ChevronRight className="size-5" />
              <div className="absolute inset-0">
                <div className="absolute inset-0 rounded-lg border border-white/20 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
                <div className="absolute inset-0 rounded-lg border border-white/40 [mask-image:linear-gradient(to_top,black,transparent)]" />
                <div className="absolute inset-0 rounded-lg shadow-[0_0_8px_#075985_inset]" />
              </div>
            </button>
          </SelectAuctionProductDialog>
        </div>
      </section>

      {upcomingAuctions?.pages.at(0)?.at(0) && (
        <section className="z-10 scroll-m-20 pt-4" id="upcoming-auctions">
          <h3 className="flex items-center space-x-2 px-2 text-2xl font-semibold xs:text-3xl sm:text-4xl md:justify-center">
            <span className="">Upcoming Auctions</span>
            <ActivityIcon className="size-6 text-purple-600 xs:size-7 sm:size-8" />
          </h3>

          <div className="mt-5 flex flex-wrap justify-center md:mt-7">
            {upcomingAuctions?.pages.at(0)?.map((auction) => (
              <div key={auction.id} className="mb-7 w-full md:w-1/2 md:p-4 xl:w-1/3">
                <AuctionCard auction={auction} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

const graphics = (
  <>
    {/* lines */}
    <div className="fixed -z-10 h-screen w-full bg-gradient-to-b from-black/80 p-4 opacity-50 lg:ml-64 lg:p-20">
      <div className="flex w-full flex-wrap">
        {new Array(700).fill('nothing').map((_, i) => (
          <div key={i} className="size-12 border border-l-0 border-t-0 border-white/5" />
        ))}
      </div>
    </div>
    {/* corner light */}
    <div className="fixed left-0 top-10 size-40 rounded-full bg-sky-400/15 blur-3xl md:size-60 lg:left-72" />
    <div className="fixed right-0 top-16 size-40 rounded-full bg-purple-400/15 blur-3xl md:size-60" />
    {/* bg-shadow */}
    <div className="fixed top-1/2 -z-10 mt-10 flex">
      <div className="size-[600px] -translate-y-1/2 translate-x-24 rounded-full bg-sky-600/10 mix-blend-multiply blur-3xl filter" />
      <div className="size-[600px] -translate-x-24 -translate-y-1/2 rounded-full bg-purple-600/10 mix-blend-multiply blur-3xl filter" />
    </div>
  </>
);
