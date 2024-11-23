'use client';

import { useAuctions } from '@/queries/use-auctions';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { AnimatePresence, motion } from 'framer-motion';
import { Dot } from 'lucide-react';
import { useEffect, useState } from 'react';

type LiveIndicator = {
  show: boolean;
  isShown: boolean;
};

export default function LiveIndicator() {
  const [show, setShow] = useState(false);
  const { data: upcomingAuctions } = useAuctions();
  const totalUpcomingAuctions =
    upcomingAuctions?.pages.map((page) => page.auctions).at(0)?.length || 0;

  useEffect(() => {
    if (!upcomingAuctions) return;
    setShow(true);
    const timeout = setTimeout(() => {
      setShow(false);
    }, 10_000);
    return () => {
      clearTimeout(timeout);
    };
  }, [upcomingAuctions]);

  return (
    <AnimatePresence>
      {show && totalUpcomingAuctions !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.98 }}
          transition={{ ease: 'easeOut', duration: 0.3, delay: 1 }}
          className="absolute top-24 z-20 w-full text-xs font-medium"
        >
          <ProgressLink
            href="/auctions"
            className="relative mx-auto flex w-fit items-center justify-center rounded-full bg-violet-950/40 px-2.5 py-0.5 text-gray-300 hover:text-gray-100 hover:underline"
          >
            <span className="absolute inset-0 rounded-full border-2 border-purple-900/40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <span className="absolute inset-0 rounded-full border-2 border-purple-900/20 [mask-image:linear-gradient(to_top,black,transparent)]" />
            <span>
              {totalUpcomingAuctions < 4 ? totalUpcomingAuctions : '4+'} Auctions coming live
            </span>
            <Dot className="size-4 scale-150 animate-pulse" />
          </ProgressLink>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
