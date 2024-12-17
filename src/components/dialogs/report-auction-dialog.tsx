'use client';

import { ReportAuctionSchema, reportAuctionSchema } from '@/lib/form-schemas';
import { imageToDataUri } from '@/lib/utils';
import { useReportAuction } from '@/mutations/use-report-auction';
import { zodResolver } from '@hookform/resolvers/zod';
import { AutoAnimate } from '@jodd/auto-animate';
import { createStore } from '@jodd/snap';
import { FlagIcon, ImageIcon, SendHorizonalIcon, XIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { openImageDialog } from './image-dialog';

const useReportAuctionDialog = createStore<{ isOpen: boolean; auctionId: string | null }>(() => ({
  isOpen: false,
  auctionId: null
}));
const onOpenChange = (isOpen: boolean) =>
  useReportAuctionDialog.setState((state) => ({
    isOpen,
    auctionId: isOpen ? state.auctionId : null
  }));
export const openReportAuctionDialog = (auctionId: string) =>
  useReportAuctionDialog.setState({ isOpen: true, auctionId });
export const closeReportAuctionDialog = () =>
  useReportAuctionDialog.setState({ isOpen: false, auctionId: null });

export default function ReportAuctionDialog() {
  const { isOpen } = useReportAuctionDialog();
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-screen flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center space-x-2">
            <FlagIcon className="size-4" />
            <span>Report auction</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <ScrollArea className="-mx-3 h-full">
          <section className="flex max-h-[calc(100vh-96px)] flex-col px-3">
            <Form />
          </section>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function Form() {
  const [imagesUris, setImagesUris] = useState<string[]>([]);
  const imagesPickerRef = useRef<HTMLInputElement>(null);
  const auctionId = useReportAuctionDialog((state) => state.auctionId);

  const unpickImages = () => {
    setImagesUris([]);
    if (imagesPickerRef.current) imagesPickerRef.current.value = '';
  };

  const onPickImages = async () => {
    if (!imagesPickerRef.current?.files) {
      unpickImages();
      return;
    }

    const imagesFiles: File[] = [];
    for (let i = 0; i < 3; i++) {
      const imageFile = imagesPickerRef.current.files[i];
      if (imageFile) imagesFiles.push(imageFile);
    }
    const imagesUris = await Promise.all(imagesFiles.map((imageFile) => imageToDataUri(imageFile)));
    setImagesUris(imagesUris);
  };

  const {
    reset,
    formState: { errors },
    register,
    handleSubmit
  } = useForm<ReportAuctionSchema>({ resolver: zodResolver(reportAuctionSchema) });

  const { mutate, isPending } = useReportAuction(auctionId!);

  const onSubmit = handleSubmit((data) => {
    if (isPending) return;
    const imagesFiles: File[] = [];
    for (let i = 0; i < 3; i++) {
      const imageFile = imagesPickerRef.current?.files && imagesPickerRef.current.files[i];
      if (imageFile) imagesFiles.push(imageFile);
    }

    mutate(
      { ...data, images: imagesFiles },
      {
        onSuccess() {
          reset();
          unpickImages();
          closeReportAuctionDialog();
        }
      }
    );
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-5">
      <Input label="Title" id="title" {...register('title')} />

      <AutoAnimate className="flex flex-col space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea {...register('text')} id="remarks" rows={6} />
        {errors.text && <p className="text-sm text-rose-500">{errors.text.message}</p>}
      </AutoAnimate>

      <section className="space-y-1.5">
        <Label htmlFor="image">Reference images</Label>
        <div
          onClick={() => imagesUris.length === 0 && imagesPickerRef.current?.click()}
          className="relative grid aspect-[48/9] place-items-center rounded-lg border border-dashed py-2"
        >
          {imagesUris.length !== 0 && (
            <div
              onClick={unpickImages}
              className="absolute right-1 top-1 cursor-pointer rounded-full bg-primary/90 p-1 text-black"
            >
              <XIcon className="size-4" />
            </div>
          )}
          <input
            type="file"
            hidden
            id="image"
            accept="image/*"
            className="hidden"
            multiple
            ref={imagesPickerRef}
            onChange={onPickImages}
          />
          {imagesUris.length === 0 && (
            <div className="flex flex-col items-center">
              <ImageIcon className="size-8" />
              <div className="p-4">
                <p className="text-sm">Provide 16:9 aspect ratio image for better compatibility</p>
                <p className="mt-0.5 text-center text-xs italic text-indigo-100/80">
                  (Max 3 images)
                </p>
              </div>
            </div>
          )}
          {imagesUris.length > 0 && (
            <div className="flex items-center justify-start space-x-2">
              {imagesUris.map((uri, i) => (
                <img
                  onClick={() => openImageDialog(uri)}
                  key={i}
                  src={uri}
                  loading="lazy"
                  decoding="async"
                  alt="selected image"
                  className="aspect-video h-full w-1/3 rounded-lg object-contain"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="text">Cancel</Button>
        </DialogClose>
        <Button
          onClick={onSubmit}
          variant="secondary"
          Icon={SendHorizonalIcon}
          loading={isPending}
          disabled={isPending}
        >
          Send Report
        </Button>
      </DialogFooter>
    </form>
  );
}
