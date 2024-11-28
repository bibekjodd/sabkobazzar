import { useWindowSize } from '@/hooks/use-window-size';
import { formatPrice } from '@/lib/utils';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

export default function WinningScreen({ auction }: { auction: Auction }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const { height, width } = useWindowSize();
  const [isShownConfetti, setIsShownConfetti] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useEffect(() => {
    if (!auction.winner?.id || !isFocused || isShownConfetti) return;
    setShowConfetti(true);
    setIsShownConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 7_000);
  }, [auction.winner?.id, isFocused, isShownConfetti]);

  if (!showConfetti || !auction.winner) return null;

  return (
    <div className="">
      <div className="fixed inset-0 z-40 grid place-items-center overflow-hidden bg-background/50 p-6 filter backdrop-blur-md">
        <div className="max-w-screen-sm text-balance text-center text-5xl font-semibold text-purple-600 [text-shadow:0_0_10px_#9333ea]">
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
