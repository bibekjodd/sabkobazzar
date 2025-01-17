import { useWindowSize } from '@/hooks/use-window-size';
import { MILLIS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

export default function WinningScreen({ auction }: { auction: Auction }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const { height, width } = useWindowSize();
  const [isShownConfetti, setIsShownConfetti] = useState(false);

  useEffect(() => {
    if (!auction.winner?.id || isShownConfetti) return;
    setShowConfetti(true);
    setIsShownConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, MILLIS.SECOND * 10);
  }, [auction.winner?.id, isShownConfetti]);

  if (!showConfetti || !auction.winner) return null;

  return (
    <div>
      <div className="fixed inset-0 z-40 grid place-items-center overflow-hidden bg-background/50 p-6 filter backdrop-blur-md">
        <div className="max-w-screen-sm text-balance text-center text-5xl font-semibold text-brand [text-shadow:0_0_10px_#9333ea]">
          {auction.winner.name} won the auction with the bid of {formatPrice(auction.finalBid!)}
        </div>
      </div>
      <Confetti
        height={height * 1.5}
        width={width - 30}
        numberOfPieces={100}
        style={{ zIndex: 50 }}
      />
    </div>
  );
}
