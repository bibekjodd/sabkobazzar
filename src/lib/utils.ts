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
