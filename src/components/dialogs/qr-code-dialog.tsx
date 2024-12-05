'use client';

import { createStore } from '@jodd/snap';
import html2canvas from 'html2canvas';
import { ArrowDownToLineIcon } from 'lucide-react';
import { useRef } from 'react';
import QrCode from 'react-qr-code';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

const useQrCodeDialog = createStore<{
  isOpen: boolean;
  value: string | null;
  content: (() => React.ReactNode) | null;
}>(() => ({
  isOpen: false,
  value: null,
  content: null
}));
const onOpenChange = (isOpen: boolean) => useQrCodeDialog.setState({ isOpen });

export const openQrCodeDialog = (value: string, content?: () => React.ReactNode) =>
  useQrCodeDialog.setState({ isOpen: true, value, content: content || null });

export const closeQrCodeDialog = () =>
  useQrCodeDialog.setState({ isOpen: false, value: null, content: null });

export default function QrCodeDialog() {
  const { isOpen, value, content: Content } = useQrCodeDialog();

  const qrCodeElementRef = useRef<HTMLDivElement>(null);

  const downloadQrCodeImage = async () => {
    if (!qrCodeElementRef.current) return;

    const canvas = await html2canvas(qrCodeElementRef.current);
    const data = canvas.toDataURL('image/jpg');

    const link = document.createElement('a');
    link.href = data;
    link.download = 'sabkobazzar-qrimage.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[calc(100%-20px)] max-w-sm"
      >
        <DialogHeader>
          <DialogTitle className="sr-only" />
        </DialogHeader>
        <DialogDescription className="sr-only" />

        <section className="flex flex-col">
          {Content && <Content />}
          <div ref={qrCodeElementRef} className="aspect-square w-64 self-center bg-white p-4">
            <QrCode className="h-auto w-full max-w-full" value={value || 'nothing'} />
          </div>
          <div className="my-2 w-fit self-center">
            <button
              onClick={downloadQrCodeImage}
              className="group flex h-9 items-center space-x-2 px-4 text-sm"
            >
              <span>Save</span>
              <ArrowDownToLineIcon className="size-3.5 group-hover:animate-bounce" />
            </button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
