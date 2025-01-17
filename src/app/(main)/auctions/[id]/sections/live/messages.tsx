import Avatar from '@/components/utils/avatar';
import { SendMessageResponse } from '@/lib/events';
import { useAuctionStore } from '@/stores/use-auction-store';
import { AnimatePresence, motion } from 'framer-motion';
import { RadioIcon, XIcon } from 'lucide-react';

export default function Messages() {
  const liveMessages = useAuctionStore((state) => state.liveMessages);
  return (
    <div className="fixed right-4 top-4 z-50 flex w-60 flex-col rounded-md bg-background/40 filter backdrop-blur-sm md:right-6 md:top-6 lg:right-10 lg:top-10">
      <AnimatePresence>
        {liveMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -7, x: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -7, x: -2 }}
            className="flex w-full items-center p-4 pb-2 text-sm text-brand"
          >
            <RadioIcon className="mr-2 size-3.5" />
            <p>Live chat</p>
            <button
              onClick={() => useAuctionStore.setState({ liveMessages: [] })}
              className="ml-auto rounded-sm p-0.5 text-foreground ring-foreground hover:ring-1"
            >
              <XIcon className="size-3.5" />
            </button>
          </motion.div>
        )}

        {liveMessages.map((message, i) => (
          <MessageItem key={i} message={message} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function MessageItem({ message }: { message: SendMessageResponse }) {
  return (
    <motion.div
      className="p-2"
      initial={{ opacity: 0, scale: 0.98, y: -7, x: -2 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -7, x: -2 }}
    >
      <div className="flex items-start space-x-3 rounded-md bg-indigo-950/20 px-2 text-sm">
        <Avatar src={message.user.image} showOnlineIndicator size="sm" />
        <div>
          <p>{message.data.text || message.data.emoji}</p>
        </div>
      </div>
    </motion.div>
  );
}
