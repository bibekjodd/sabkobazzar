type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  image: string | null;
  phone: number | null;
  lastOnline: string;
};

type UserProfile = User & {
  lastNotificationReadAt: string;
  totalUnreadNotifications: number;
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
  isInterested: boolean;
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
  isCompleted: boolean;
  isCancelled: boolean;
  owner: User;
  product: Omit<Product, 'owner'>;
  isInviteOnly: boolean;
  participationStatus: ParticipationStatus;
  totalParticipants: number;
} & ({ winner: null; isUnbidded: true } | { winner: User; isUnbidded: false });
type ParticipationStatus = 'joined' | 'invited' | 'kicked' | 'rejected' | null;

type UserNotification = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  receivedAt: string;
  entity: string;
  params?: string;
  user: User;
  type?: string;
};

type Bid = {
  id: string;
  auctionId: string;
  bidderId: string;
  at: string;
  amount: number;
  bidder: User;
};
