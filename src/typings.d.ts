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

type Auction = {
  id: string;
  banner: string | null;
  ownerId: string;
  winnerId: string | null;
  title: string;
  description: string | null;
  productTitle: string;
  category: 'arts' | 'electronics' | 'realestate' | 'others';
  productImages: string[] | null;
  brand: string | null;
  lot: number;
  condition: 'new' | 'first-class' | 'repairable';
  startsAt: string;
  endsAt: string;
  minBid: number;
  finalBid: number | null;
  minBidders: number;
  maxBidders: number;
  owner: User;
  winner: User | null;
  isInviteOnly: boolean;
  isInterested: boolean;
  participationStatus: ParticipationStatus;
  totalParticipants: number;
  status: 'pending' | 'cancelled' | 'completed' | 'unbidded';
  cancelReason: string | null;
  createdAt: string;
};
type ParticipationStatus = 'joined' | 'invited' | 'kicked' | 'rejected' | null;

type UserNotification = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  createdAt: string;
  entity: string;
  params?: string;
  user: User;
  type?: string;
};

type Bid = {
  id: string;
  auctionId: string;
  bidderId: string;
  createdAt: string;
  amount: number;
  bidder: User;
};
