'use client';
import { dummyProductImage, productConditions } from '@/lib/constants';
import { registerAuctionSchema, RegisterAuctionSchema } from '@/lib/form-schemas';
import { imageToDataUri } from '@/lib/utils';
import { registerAuctionKey, useRegisterAuction } from '@/mutations/use-register-auction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIsMutating } from '@tanstack/react-query';
import { ImageIcon, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { FormInput } from '../utils/form-input';

type CalendarDate = Date | null | [Date | null, Date | null];
type Props = { children: React.ReactNode; product: Product };
export default function RegisterAuctionDialog({ children, product }: Props) {
  const [date, onChange] = useState<CalendarDate>(() => new Date());
  const [imageUri, setImageUri] = useState<string | null>(product.image || dummyProductImage);
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const pickImage = async () => {
    if (!imagePickerRef.current?.files) return;
    const imageUri = await imageToDataUri(imagePickerRef.current.files[0]);
    setImageUri(imageUri);
  };

  const unpickImage = () => {
    if (imagePickerRef.current) imagePickerRef.current.value = '';
    setImageUri(null);
  };

  const {
    formState: { errors },
    handleSubmit,
    register,
    control,
    reset
  } = useForm<RegisterAuctionSchema>({
    mode: 'onTouched',
    resolver: zodResolver(registerAuctionSchema),
    defaultValues: {
      startsAt: new Date(date?.toString() || Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      minBid: 10000,
      minBidders: 2,
      maxBidders: 10,
      lot: 1,
      condition: 'first-class',
      isInviteOnly: false
    }
  });
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isRegisteringAuction = !!useIsMutating({ mutationKey: registerAuctionKey });
  const { mutate } = useRegisterAuction();

  const onSubmit = handleSubmit((data: RegisterAuctionSchema) => {
    let image: File | undefined = undefined;
    if (imagePickerRef.current?.files) image = imagePickerRef.current.files[0];
    mutate(
      { productId: product.id, ...data, image },
      {
        onSuccess() {
          reset();
          closeButtonRef.current?.click();
        }
      }
    );
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-screen flex-col bg-background/50 filter backdrop-blur-3xl">
        <DialogHeader>
          <DialogTitle className="text-center">Register an auction</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="flex h-full flex-col space-y-7 overflow-y-auto px-1 pb-6 scrollbar-thin"
        >
          <FormInput
            Icon={null}
            id="title"
            error={errors.title?.message}
            label="Title"
            placeholder="Auction title..."
            {...register('title')}
          />

          <section className="space-y-1">
            <Label htmlFor="image">Banner image</Label>
            <div
              onClick={() => !imageUri && imagePickerRef.current?.click()}
              className="relative grid aspect-video place-items-center rounded-lg border"
            >
              {imageUri && (
                <div
                  onClick={unpickImage}
                  className="absolute right-1 top-1 cursor-pointer rounded-full bg-primary/90 p-1 text-black"
                >
                  <X className="size-4" />
                </div>
              )}
              <input
                type="file"
                hidden
                id="image"
                accept="image/*"
                className="hidden"
                ref={imagePickerRef}
                onChange={pickImage}
              />
              {!imageUri && (
                <div className="flex flex-col items-center">
                  <ImageIcon className="size-8" />
                  <p className="p-4 text-sm">
                    Provide 16:9 aspect ratio image for better compatibility
                  </p>
                </div>
              )}
              {imageUri && (
                <img
                  src={imageUri}
                  alt="selected image"
                  className="aspect-video w-full rounded-lg object-contain"
                />
              )}
            </div>
          </section>

          <section className="flex flex-col space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...register('description')}
              id="description"
              placeholder="Auction description..."
              rows={6}
            />
            {errors.description?.message && (
              <p className="text-sm text-rose-500">{errors.description.message}</p>
            )}
          </section>

          <section className="flex w-full flex-col space-y-2">
            <Label htmlFor="calendar">Select auction date</Label>
            <Controller
              control={control}
              name="startsAt"
              render={({ field }) => (
                <Calendar
                  view="month"
                  className="!w-full !border-border !bg-transparent"
                  value={date}
                  onChange={(value) => {
                    onChange(value);
                    field.onChange(
                      new Date(value?.toString() || Date.now() + 6 * 60 * 60 * 1000).toISOString()
                    );
                  }}
                  minDate={new Date(Date.now() + 3 * 60 * 60 * 1000)}
                  maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                />
              )}
            />
          </section>

          <FormInput
            Icon={null}
            error={errors.lot?.message}
            id="lot"
            label="Current lot"
            placeholder="lot number of product..."
            type="number"
            {...register('lot')}
          />

          <section className="flex flex-col space-y-2">
            <Label>Condition</Label>
            <Controller
              control={control}
              name="condition"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="First Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {productConditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </section>

          <FormInput
            Icon={null}
            error={errors.minBid?.message}
            id="minBid"
            label="Minimum Bid"
            placeholder="Minimum bid value..."
            type="number"
            {...register('minBid')}
          />
          <FormInput
            Icon={null}
            error={errors.minBidders?.message}
            id="minBidders"
            label="Minimum Biders"
            placeholder="Minimum number of bidders"
            type="number"
            {...register('minBidders', { required: true })}
          />
          <FormInput
            Icon={null}
            error={errors.maxBidders?.message}
            id="maxBidders"
            label="Maximum Biders"
            placeholder="Maximum number of bidders"
            type="number"
            {...register('maxBidders', { required: true })}
          />

          <section className="flex items-center space-x-2">
            <Controller
              control={control}
              name="isInviteOnly"
              render={({ field }) => (
                <Checkbox
                  id="isInviteOnly"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="isInviteOnly">Only allow invited members to join the auction</Label>
          </section>
        </form>

        <DialogFooter>
          <DialogClose asChild ref={closeButtonRef}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
            variant="theme-secondary"
            onClick={onSubmit}
            loading={isRegisteringAuction}
            disabled={isRegisteringAuction}
          >
            Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
