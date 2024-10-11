export const EVENTS = {
  JOINED_AUCTION: 'joined-auction',
  LEFT_AUCTION: 'left-auction',
  SENT_MESSAGE: 'sent-message',
  BID: 'bid',
  RECEIVED_NOTIFICATION: 'received-notification'
};

export type JoinedAuctionResponse = {
  user: User;
};
export type LeftAuctionResponse = JoinedAuctionResponse;
export type SendMessageResponse = { text?: string; emoji?: string };
export type BidResponse = { bid: Bid };
export type ReceivedNotificationResponse = {
  notification: UserNotification;
};
