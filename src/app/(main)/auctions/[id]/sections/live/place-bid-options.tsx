import { cn, formatPrice, getBidAmountOptions } from '@/lib/utils';
import { placeBidKey } from '@/mutations/use-place-bid';
import { useBidsSnapshot } from '@/queries/use-bids-snapshot';
import { useProfile } from '@/queries/use-profile';
import { useAuctionStore } from '@/stores/use-auction-store';
import { useIsMutating } from '@tanstack/react-query';
import { ArrowRightIcon, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { openPlaceBidDialog } from './place-bid-dialog';

type Props = { minBid: number; auctionId: string };
export default function PlaceBidOptions({ auctionId, minBid }: Props) {
  const [inputAmount, setInputAmount] = useState(minBid.toString());
  const isValidInputAmount = !!Number(inputAmount);
  const { data: bidsSnapshot } = useBidsSnapshot(auctionId);
  const isPlacingBid = !!useIsMutating({ mutationKey: placeBidKey(auctionId) });
  const lastBid = bidsSnapshot?.at(0);
  const { data: profile } = useProfile();
  const isLive = useAuctionStore((state) => state.isLive);
  const disabled =
    !isLive || ((isPlacingBid || lastBid?.bidderId === profile?.id) && lastBid?.amount !== 0);

  const placeBid = (amount: number) => {
    if (!isValidInputAmount || disabled || !amount) return;
    openPlaceBidDialog({ auctionId, amount });
  };

  const bidAmounts = getBidAmountOptions(lastBid?.amount || minBid);

  const onInputAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.match(/^[0-9]*$/)) setInputAmount(value);
  };
  const isParticipant = useAuctionStore((state) => state.auction?.participationStatus === 'joined');
  if (!isParticipant) return null;

  return (
    <section className="flex flex-col items-center pb-6 text-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center space-x-5">
          <span>Bid</span>
          <input
            value={inputAmount}
            disabled={disabled}
            onChange={onInputAmount}
            className="w-24 border-b-2 border-gray-700/50 py-1 text-center focus:border-gray-600 focus:outline-none disabled:opacity-50"
          />
          <button
            disabled={disabled}
            onClick={() => placeBid(Number(inputAmount))}
            className="size-fit rounded-full bg-gradient-to-b from-gray-200 to-gray-300/80 p-2 text-background hover:brightness-125 disabled:pointer-events-none disabled:opacity-50"
          >
            {isPlacingBid ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowRightIcon className="size-4" />
            )}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          {bidAmounts.map((amount, i) => (
            <button
              key={i}
              disabled={disabled}
              onClick={() => placeBid(amount)}
              className={cn(
                (i === 2 || i === 3) && 'hidden sm:block',
                'relative m-0.5 h-9 overflow-hidden rounded-md bg-gradient-to-b from-gray-200 to-gray-300/80 px-4 text-xs font-semibold text-background transition hover:brightness-110 active:scale-95 disabled:pointer-events-none disabled:opacity-50 xs:text-sm'
              )}
            >
              {formatPrice(amount)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
