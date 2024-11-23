import {
  ArrowDownAzIcon,
  ArrowDownWideNarrowIcon,
  ArrowUpAzIcon,
  ArrowUpNarrowWideIcon,
  BadgeMinusIcon,
  BoxIcon,
  CircleMinusIcon,
  EggFriedIcon,
  LucideIcon,
  RouteOffIcon,
  UserIcon,
  UserPlusIcon,
  WebhookIcon
} from 'lucide-react';

export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const dummyUserImage = 'https://avatars.githubusercontent.com/u/110604197?v=4';
export const dummyProductImage =
  'https://cdn.sanity.io/images/tlr8oxjg/production/7b7f05720074a848850e0705779306c27da5a6cf-1065x597.png?w=3840&q=100&fit=clip&auto=format';

export const productsCategories: { title: string; value: string }[] = [
  { title: 'Arts', value: 'arts' },
  { title: 'Electronics', value: 'electronics' },
  { title: 'Real Estate', value: 'realestate' },
  { title: 'Others', value: 'others' }
] as const;

export const productConditions = [
  { title: 'New', value: 'new' },
  { title: 'First Class', value: 'first-class' },
  { title: 'Repariable', value: 'repairable' }
] as const;

export const productsResultSortOptions = [
  {
    title: 'Title ascending',
    value: 'title_asc',
    Icon: ArrowDownAzIcon
  },
  {
    title: 'Title descending',
    value: 'title_desc',
    Icon: ArrowUpAzIcon
  },
  {
    title: 'Price low to high',
    value: 'price_asc',
    Icon: ArrowUpNarrowWideIcon
  },
  {
    title: 'Price high to low',
    value: 'price_desc',
    Icon: ArrowDownWideNarrowIcon
  }
] as const;

const facebookImage = 'https://i.postimg.cc/8CHsQjWC/facebook.png';
const xImage = 'https://i.postimg.cc/BZ78tdfP/x.png';
const instagramImage = 'https://i.postimg.cc/g0drTvx5/instagram.png';

export const socialLinks = [
  { title: 'Facebook', image: facebookImage },
  { title: 'Instagram', image: instagramImage },
  { title: 'X', image: xImage }
];

export const MILLIS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000
};

type NotificationMapItem = {
  Icon: LucideIcon;
  severity: 'neutral' | 'warning' | 'critical' | 'success' | 'info' | 'acknowledge';
};
export const NOTIFICATION_MAP: Record<string, NotificationMapItem | undefined> = {
  'users-': { Icon: UserIcon, severity: 'neutral' },
  'products-': { Icon: BoxIcon, severity: 'neutral' },
  'auctions-': { Icon: WebhookIcon, severity: 'neutral' },
  'auctions-register': { Icon: EggFriedIcon, severity: 'success' },
  'auctions-join': { Icon: EggFriedIcon, severity: 'success' },
  'auctions-invite': { Icon: UserPlusIcon, severity: 'acknowledge' },
  'auctions-leave': { Icon: BadgeMinusIcon, severity: 'info' },
  'auctions-kick': { Icon: CircleMinusIcon, severity: 'critical' },
  'auctions-cancel': { Icon: RouteOffIcon, severity: 'info' }
};
