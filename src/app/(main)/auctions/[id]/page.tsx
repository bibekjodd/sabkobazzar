'use client';
import AuctionOverview from '@/components/auction-overview';
import AuctionCard from '@/components/cards/auction-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuction } from '@/queries/use-auction';
import { useUpcomingAuctions } from '@/queries/use-upcoming-auctions';
import { ActivityIcon, CircleAlert } from 'lucide-react';

type Props = { params: { id: string } };
export default function Page({ params: { id } }: Props) {
  const { data: auction, error } = useAuction(id);
  const { data } = useUpcomingAuctions({ ownerId: null, productId: null });

  const upcomingAuctions = data?.pages.flat(1).filter((auction) => auction.id !== id);

  return (
    <main className="cont">
      {graphics}
      {error && (
        <div className="p-4">
          <Alert variant="destructive" className="bg-destructive/10">
            <CircleAlert className="size-4" />
            <AlertTitle>Could not get auctions details!</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </div>
      )}
      {auction && (
        <div className="grid min-h-[calc(100vh-80px)] place-items-center py-7">
          <AuctionOverview auction={auction} showProductLinkButton />
        </div>
      )}

      {upcomingAuctions?.at(0) && (
        <section className="relative z-10 scroll-m-20 pt-4" id="upcoming-auctions">
          <h3 className="flex items-center space-x-2 px-2 text-2xl font-semibold xs:text-3xl sm:text-4xl md:justify-center">
            <span className="">Explore more auctions</span>
            <ActivityIcon className="size-6 text-purple-600 xs:size-7 sm:size-8" />
          </h3>

          <div className="mt-5 flex flex-wrap justify-center md:mt-7">
            {upcomingAuctions.slice(0, 6).map((auction) => (
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
    <div className="fixed right-5 top-16 -z-10 size-40 rounded-full bg-purple-400/15 blur-3xl filter md:size-80" />
    <div className="fixed left-5 top-16 -z-10 size-40 rounded-full bg-sky-400/15 blur-3xl filter md:size-80" />
  </>
);
