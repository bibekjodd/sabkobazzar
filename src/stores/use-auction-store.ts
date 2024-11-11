import { MILLIS } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { isAuctionLive, isAuctionReady, setImmediateInterval } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { createStore } from '@jodd/snap';

type Timer = { hours: number; minutes: number; seconds: number };
type State = {
  isStoreLoaded: boolean;
  auction: Auction | null;
  isReady: boolean;
  isLive: boolean;
  isLivePrevious: boolean;
  startTimer: Timer;
  finishTimer: Timer;
};

type Actions = {
  onAuctionChange: (auction: Auction | null) => void;
};

let readyTimerRef: NodeJS.Timeout | null = null;
let finishTimerRef: NodeJS.Timeout | null = null;

let readyTimeoutRef: NodeJS.Timeout | null = null;
let startTimeoutRef: NodeJS.Timeout | null = null;
let finishTimeoutRef: NodeJS.Timeout | null = null;

export const useAuctionStore = createStore<State & Actions>((set) => ({
  isStoreLoaded: false,
  auction: null,
  isReady: false,
  isLive: false,
  isLivePrevious: false,
  startTimer: { hours: 0, minutes: 0, seconds: 0 },
  finishTimer: { hours: 0, minutes: 0, seconds: 0 },

  onAuctionChange(auction) {
    if (!auction) {
      if (readyTimeoutRef) clearTimeout(readyTimeoutRef);
      if (startTimeoutRef) clearTimeout(startTimeoutRef);
      if (finishTimeoutRef) clearTimeout(finishTimeoutRef);
      set({ auction: null, isStoreLoaded: false });
      return;
    }

    const isReady = isAuctionReady(auction);
    const isLive = isAuctionLive(auction);
    set({ auction, isLive, isReady, isStoreLoaded: true });

    if (isReady) {
      if (readyTimerRef) clearInterval(readyTimerRef);
      readyTimerRef = setImmediateInterval(() => {
        const startTimer = calculateTimer(auction.startsAt);
        set({ startTimer });
      }, 1000);
    } else {
      if (readyTimerRef) clearInterval(readyTimerRef);
      readyTimerRef = null;
    }

    if (isLive) {
      if (finishTimerRef) clearInterval(finishTimerRef);
      finishTimerRef = setImmediateInterval(() => {
        const finishTimer = calculateTimer(auction.endsAt);
        set({ finishTimer });
      }, 1000);
    } else {
      if (finishTimerRef) clearInterval(finishTimerRef);
      finishTimerRef = null;
    }

    const timeToStart = new Date(auction.startsAt).getTime() - Date.now();
    const timeToReady = timeToStart - MILLIS.MINUTE;
    const timeToFinish = new Date(auction.endsAt).getTime() - Date.now();

    if (timeToReady >= 0 && timeToReady < MILLIS.DAY) {
      if (readyTimeoutRef) clearTimeout(readyTimeoutRef);
      readyTimeoutRef = setTimeout(() => {
        set({ isReady: true });
        refetchAuction();
      }, timeToReady);
    }
    if (timeToStart >= 0 && timeToStart < MILLIS.DAY) {
      if (startTimeoutRef) clearTimeout(startTimeoutRef);
      startTimeoutRef = setTimeout(() => {
        set({ isLive: true, isReady: false });
        refetchAuction();
      }, timeToStart);
    }
    if (timeToFinish >= 0 && timeToFinish < MILLIS.DAY) {
      if (finishTimeoutRef) clearTimeout(finishTimeoutRef);
      finishTimeoutRef = setTimeout(() => {
        set({ isLivePrevious: true, isLive: false });
        refetchAuction();
      }, timeToFinish);
    }
  }
}));

const refetchAuction = () => {
  const auctionId = useAuctionStore.getState().auction?.id;
  if (!auctionId) return;
  const queryClient = getQueryClient();
  const isFetching = queryClient.isFetching({ queryKey: auctionKey(auctionId) });
  if (isFetching) return;
  queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
};

const calculateTimer = (target: string): Timer => {
  let remainingTime = new Date(target).getTime() - Date.now();
  if (remainingTime < 0) return { hours: 0, minutes: 0, seconds: 0 };

  const hours = Math.floor(remainingTime / MILLIS.HOUR);
  remainingTime -= hours * MILLIS.HOUR;

  const minutes = Math.floor(remainingTime / MILLIS.MINUTE);
  remainingTime -= minutes * MILLIS.MINUTE;

  const seconds = Math.floor(remainingTime / 1000);
  return { hours, minutes, seconds };
};
