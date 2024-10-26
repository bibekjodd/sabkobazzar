import axios, { AxiosError } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { backendUrl } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const redirectToLogin = () => {
  window.open(`${backendUrl}/api/auth/login/google?redirect=${location.origin}`, '_blank');
};

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data.message || error.message;
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error occurred!';
};

export const wait = async (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('okay');
    }, time);
  });
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(price);
};

export const getSearchString = (searchParameters: Record<string, unknown>): string => {
  let searchString = '';
  const keys = Object.keys(searchParameters).sort();
  for (const key of keys) {
    if (!key || !searchParameters[key]) continue;
    searchString += `&${key}=${searchParameters[key]}`;
  }
  searchString = searchString.slice(1);
  if (searchString) return '?' + searchString;
  return '';
};

export const imageToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', (event) => {
      const result = event.target?.result?.toString();
      resolve(result || '');
    });
  });
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      formData
    );
    return data.data.display_url;
  } catch (error) {
    const message = `Could not upload image! ${error instanceof Error ? error.message : ''}`;
    throw new Error(message);
  }
};

export const formatDate = (value: string | Date | number) => {
  const date = new Date(value);
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${month} ${day}, ${hours % 12 || 12}${minutes === 0 ? '' : `:${minutes}`}${hours > 12 ? 'pm' : 'am'}`;
};

export const isAuctionPending = (auction: Auction) => {
  return (
    !auction.isCancelled && !auction.isFinished && Date.now() < new Date(auction.startsAt).getTime()
  );
};

export const isAuctionLive = (auction: Auction) => {
  return (
    !auction.isCancelled &&
    !auction.isFinished &&
    Date.now() >= new Date(auction.startsAt).getTime() &&
    Date.now() < new Date(auction.startsAt).getTime() + 60 * 60 * 1000
  );
};

export const canJoinAuction = ({
  auction,
  userId
}: {
  auction: Auction;
  userId: string;
}): boolean => {
  return !!(
    !auction.isCancelled &&
    !auction.isFinished &&
    Date.now() < new Date(auction.startsAt).getTime() &&
    userId !== auction.ownerId &&
    (auction.isInviteOnly
      ? auction.participationStatus === 'invited'
      : auction.participationStatus === null)
  );
};

export const canCancelAuction = ({
  auction,
  userId
}: {
  auction: Auction;
  userId: string;
}): boolean => {
  return userId === auction.ownerId && !auction.isCancelled && !auction.isFinished;
};

export const canLeaveAuction = ({ auction }: { auction: Auction }): boolean => {
  return (
    auction.participationStatus === 'joined' &&
    !auction.isCancelled &&
    !auction.isFinished &&
    Date.now() + 3 * 60 * 60 * 1000 < new Date(auction.startsAt).getTime()
  );
};

export const getBidAmountOptions = (amount: number): number[] => {
  const amounts = [
    amount * 1.06,
    amount * 1.1,
    amount * 1.2,
    amount * 1.3,
    amount * 1.4,
    amount * 1.5
  ];
  let balancer = 500;
  if (amount > 100_000) balancer = 1000;
  if (amount > 500_000) balancer = 5000;
  if (amount > 1_000_000) balancer = 10_000;
  if (amount > 10_000_000) balancer = 50_000;
  if (amount > 100_000_000) balancer = 100_000;
  return amounts.map((amount) => amount - (amount % balancer));
};
