'use client';

import { useAuctions } from '@/queries/use-auctions';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { AnimatePresence, motion } from 'framer-motion';
import { Dot } from 'lucide-react';

type LiveIndicator = {
  show: boolean;
  isShown: boolean;
};

export default function LiveIndicator() {
  const { data: auctions } = useAuctions({ status: 'pending' });

  return (
    <AnimatePresence>
      {auctions?.length !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ease: 'easeOut', duration: 0.3, delay: 1 }}
          className="absolute top-24 z-20 w-full text-xs"
        >
          <ProgressLink
            href="/auctions"
            className="relative mx-auto flex w-fit items-center justify-center rounded-full bg-brand/5 px-3 py-1 text-foreground hover:underline"
          >
            <span className="absolute inset-0 rounded-full border-2 border-brand/10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <span className="absolute inset-0 rounded-full border-2 border-brand-lighter/5 [mask-image:linear-gradient(to_top,black,transparent)]" />
            <span>
              {(auctions?.length || 0) < 10 ? auctions?.length : '9+'}{' '}
              <span className="mx-1">Auctions coming live</span>
            </span>
            <Dot className="size-4 scale-150 animate-pulse" />
          </ProgressLink>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
