import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { sendMessageKey, useSendMessage } from '@/mutations/use-send-message';
import { useAuctionStore } from '@/stores/use-auction-store';
import { createStore } from '@jodd/snap';
import { useIsMutating } from '@tanstack/react-query';
import { Loader2, MessageSquareTextIcon, SendIcon } from 'lucide-react';
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

  const isParticipant = useAuctionStore((state) => state.auction?.participationStatus === 'joined');
  if (!isParticipant) return null;

  return (
    <div className="flex space-x-3 p-4 pt-2 text-sm">
      <div className="relative flex-grow rounded-xl border-2 border-brand/15 pb-4 focus-within:border-brand/30">
        <textarea
          disabled={isSendingMessage || !isLive}
          placeholder="Enter a message..."
          value={message}
          ref={inputElementRef}
          rows={2}
          onChange={(e) => setMessage(e.target.value.slice(0, 200))}
          className="w-full resize-none rounded-xl p-3 pb-1 text-sm font-normal text-muted-foreground scrollbar-hide placeholder:text-muted-foreground"
        />
        <span className="absolute bottom-2 right-2 text-xs italic text-muted-foreground/80">
          {message.length}/200
        </span>
      </div>

      <button
        disabled={disabled}
        onClick={sendMessage}
        className="grid size-7 place-items-center self-end rounded-full bg-gradient-to-br from-brand-darker/70 to-brand-darker/80 text-background disabled:opacity-50"
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

const useDialog = createStore<{ isOpen: boolean }>(() => ({
  isOpen: false
}));
const onOpenChange = (isOpen: boolean) => useDialog.setState({ isOpen });

export const openSendMessageDialog = () => onOpenChange(true);
export const closeSendMessageDialog = () => onOpenChange(false);

export function SendMessageDialog({ auctionId }: { auctionId: string }) {
  const { isOpen } = useDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquareTextIcon className="size-5" />
            <span>Send Message</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <section className="px-2">
          <SendMessage auctionId={auctionId!} />
        </section>
      </DialogContent>
    </Dialog>
  );
}
