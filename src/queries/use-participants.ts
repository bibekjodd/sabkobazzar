import { backendUrl } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const participantsKey = (auctionId: string) => ['participants', auctionId];
export const useParticipants = (auctionId: string) => {
  return useQuery({
    queryKey: participantsKey(auctionId),
    queryFn: ({ signal }) => fetchParticipants({ auctionId, signal })
  });
};

const fetchParticipants = async ({
  auctionId,
  signal
}: {
  auctionId: string;
  signal: AbortSignal;
}): Promise<User[]> => {
  const res = await axios.get<{ participants: User[] }>(
    `${backendUrl}/api/auctions/${auctionId}/participants`,
    { signal }
  );
  return res.data.participants;
};
