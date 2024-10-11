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

export const extractErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError) {
    return err.response?.data.message || err.message;
  } else if (err instanceof Error) {
    return err.message;
  }
  return 'Unknown error occurred!';
};

export const wait = async (time = 1000) => {
  return new Promise((res) => {
    setTimeout(() => {
      res('okay');
    }, time);
  });
};

export const formatPrice = (price: number): string => {
  let priceStr = price.toString().split('').reverse().join('');
  let formattedPrice = '';
  while (priceStr !== '') {
    formattedPrice += `,${priceStr.slice(0, 3)}`;
    priceStr = priceStr.slice(3);
  }
  return formattedPrice.split('').reverse().join('').slice(0, -1);
};

export const getSearchString = (searchParams: Record<string, unknown>): string => {
  let searchString = '';
  const keys = Object.keys(searchParams).sort();
  keys.forEach((key) => {
    if (!key || !searchParams[key]) return;
    searchString += `&${key}=${searchParams[key]}`;
  });
  searchString = searchString.slice(1);
  if (searchString) return '?' + searchString;
  return '';
};

export const imageToDataUri = (file: File): Promise<string> => {
  return new Promise((res) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', (ev) => {
      const result = ev.target?.result?.toString();
      res(result || '');
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
    throw new Error('Could not upload image');
  }
};

export const formatDate = (value: string | Date | number) => {
  const date = new Date(value);
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${month} ${day}, ${hours % 12 || 12}${minutes !== 0 ? `:${minutes}` : ''}${hours > 12 ? 'pm' : 'am'}`;
};

export const isJoinedAuction = ({
  auction,
  userId
}: {
  auction: Auction;
  userId: string;
}): boolean => {
  return !!auction.participants.find((participant) => participant.id === userId);
};

export const canJoinAuction = ({
  auction,
  userId
}: {
  auction: Auction;
  userId: string;
}): boolean => {
  return (
    !isJoinedAuction({ auction, userId }) &&
    !auction.isCancelled &&
    !auction.isFinished &&
    Date.now() < new Date(auction.startsAt).getTime() &&
    userId !== auction.ownerId
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

export const canLeaveAuction = ({
  auction,
  userId
}: {
  auction: Auction;
  userId: string;
}): boolean => {
  return (
    isJoinedAuction({ auction, userId }) &&
    !auction.isCancelled &&
    !auction.isFinished &&
    Date.now() + 3 * 60 * 60 * 1000 < new Date(auction.startsAt).getTime()
  );
};

export const isAuctionLive = (auction: Auction) => {
  return (
    auction &&
    !auction.isCancelled &&
    !auction.isFinished &&
    Date.now() >= new Date(auction.startsAt).getTime() &&
    Date.now() < new Date(auction.startsAt).getTime() + 60 * 60 * 1000
  );
};

export const getBidAmountOptions = (amount: number): number[] => {
  amount = Math.ceil(amount / 1000) * 1000;
  if (amount > 100_000) amount = amount - (amount % 5000);
  if (amount < 50_000) {
    return [
      amount + 1_000,
      amount + 2_500,
      amount + 5_000,
      amount + 7_500,
      amount + 10_000,
      amount + 12_500
    ];
  }
  if (amount < 100_000)
    return [
      amount + 1_000,
      amount + 2_500,
      amount + 5_000,
      amount + 10_000,
      amount + 12_500,
      amount + 15_000
    ];
  if (amount < 1_000_000)
    return [
      amount + 5_000,
      amount + 20_000,
      amount + 25_000,
      amount + 50_000,
      amount + 75_000,
      amount + 100_000
    ];
  if (amount < 10_000_000)
    return [
      amount + 10_000,
      amount + 25_000,
      amount + 50_000,
      amount + 75_000,
      amount + 100_000,
      amount + 125_000
    ];
  return [
    amount + 100_000,
    amount + 250_000,
    amount + 500_000,
    amount + 750_000,
    amount + 1_000_000,
    amount + 1_500_000
  ];
};
