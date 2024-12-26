import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

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
  const res = await apiClient.get<{ participants: User[] }>(
    `/api/auctions/${auctionId}/participants`,
    { signal }
  );
  return res.data.participants;
};
