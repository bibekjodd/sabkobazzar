type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  image: string | null;
  phone: number | null;
  lastOnline: string;
};

type Product = {
  id: string;
  title: string;
  image: string | null;
  category: 'electronics' | 'realestate' | 'art' | 'others';
  description: string | null;
  ownerId: string;
  price: number;
  addedAt: string;
  owner: User;
};

type Auction = {
  id: string;
  productId: string;
  banner: string | null;
  ownerId: string;
  winnerId: string | null;
  title: string;
  description: string | null;
  lot: number;
  condition: 'new' | 'first-class' | 'repairable';
  startsAt: string;
  endsAt: string;
  minBid: number;
  finalBid: number | null;
  minBidders: number;
  maxBidders: number;
  isFinished: boolean;
  isCancelled: boolean;
  owner: User;
  product: Product;
};
