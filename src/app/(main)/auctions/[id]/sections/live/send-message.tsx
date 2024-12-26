import { sendMessageKey, useSendMessage } from '@/mutations/use-send-message';
import { useAuctionStore } from '@/stores/use-auction-store';
import { useIsMutating } from '@tanstack/react-query';
import { Loader2, SendIcon } from 'lucide-react';
import { useRef, useState } from 'react';

export default function SendMessage({ auctionId }: { auctionId: string }) {
  const [message, setMessage] = useState('');
  const inputElementRef = useRef<HTMLTextAreaElement>(null);
  const { mutate } = useSendMessage(auctionId);
  const isSendingMessage = !!useIsMutating({ mutationKey: sendMessageKey(auctionId) });
  const isLive = useAuctionStore((state) => state.isLive);
  const disabled = !message.trim() || isSendingMessage || !isLive;

  const sendMessage = () => {
    if (disabled) return;
    const text = message.trim();
    setMessage('');
    mutate(
      { text, emoji: undefined },
      {
        onError() {
          if (!message) setMessage(text);
        }
      }
    );
  };

  return (
    <div className="flex space-x-3 p-4 pt-2 text-sm">
      <div className="flex-grow rounded-xl border-2 border-brand-darker/15 p-2 focus-within:border-brand-darker/25">
        <textarea
          disabled={disabled}
          placeholder="Enter a message..."
          value={message}
          ref={inputElementRef}
          onChange={(e) => setMessage(e.target.value.slice(0, 200))}
          className="h-10 resize-none text-sm font-normal text-muted-foreground scrollbar-hide placeholder:text-muted-foreground"
        />
      </div>
      <button
        disabled={disabled}
        onClick={sendMessage}
        className="grid size-7 place-items-center self-end rounded-full bg-gradient-to-br from-indigo-800/80 to-violet-800/80 text-background disabled:opacity-50"
      >
        {isSendingMessage ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <SendIcon className="size-4 fill-muted-foreground text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
