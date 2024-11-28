'use client';

import { dummyProductImage, MILLIS, productConditions } from '@/lib/constants';
import { registerAuctionSchema, RegisterAuctionSchema } from '@/lib/form-schemas';
import { imageToDataUri } from '@/lib/utils';
import { registerAuctionKey, useRegisterAuction } from '@/mutations/use-register-auction';
import { zodResolver } from '@hookform/resolvers/zod';
import { AutoAnimate } from '@jodd/auto-animate';
import { useIsMutating } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { CalendarIcon, ImageIcon, X } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

type Props = { children: React.ReactNode; product: Product };
export default function RegisterAuctionDialog({ children, product }: Props) {
  const [date, setDate] = useState<Date>();
  const [hours, setHours] = useState(10);
  const [timeOfTheDay, setTimeOfTheDay] = useState<'am' | 'pm'>('am');
  const fullDate = useMemo(() => {
    if (!date) return undefined;
    const fullDate = new Date(date);
    fullDate.setHours(timeOfTheDay === 'am' ? hours : hours + 12);
    return fullDate;
  }, [date, hours, timeOfTheDay]);

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
          unpickImage();
          closeButtonRef.current?.click();
        }
      }
    );
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="px-0">
        <DialogHeader className="px-6">
          <DialogTitle className="text-center">Register an auction</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <ScrollArea className="mx-1 flex h-full flex-col px-5 scrollbar-hide">
          <form onSubmit={onSubmit} className="flex h-full flex-col space-y-7 px-1 pb-6">
            <Input
              id="title"
              label="Title"
              error={errors.title?.message}
              placeholder="Auction title..."
              {...register('title')}
            />

            <section className="space-y-1.5">
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

            <section className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register('description')}
                id="description"
                placeholder="Auction description..."
                rows={6}
                className="scrollbar-thin"
              />
              {errors.description?.message && (
                <p className="text-sm text-rose-500">{errors.description.message}</p>
              )}
            </section>

            <Controller
              control={control}
              name="startsAt"
              render={({ field }) => (
                <div className="flex flex-col space-y-3">
                  <AutoAnimate className="flex w-full flex-col space-y-2">
                    <Label htmlFor="calendar">Auction Date</Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center justify-start">
                          <CalendarIcon className="mr-2 size-4" />
                          {!fullDate && <span>Select</span>}
                          {fullDate && dayjs(fullDate).format('dddd, MMMM DD, ha')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-background/40 filter backdrop-blur-3xl">
                        <Calendar
                          mode="single"
                          fromDate={new Date(Date.now() + MILLIS.DAY * 2)}
                          toDate={new Date(Date.now() + MILLIS.MONTH)}
                          selected={date}
                          onSelect={(date) => {
                            setDate(date);
                            if (!date) return field.onChange(undefined);

                            const fullDate = new Date(date);
                            fullDate.setHours(timeOfTheDay === 'am' ? hours : hours + 12);
                            field.onChange(fullDate.toISOString());
                          }}
                        />

                        <div className="mt-2 space-y-1.5">
                          <Label>Time</Label>
                          <section className="flex items-center space-x-3">
                            <Select
                              value={hours.toString()}
                              onValueChange={(value) => {
                                const hours = Number(value) || 10;
                                setHours(hours);

                                if (!date) return;

                                const fullDate = new Date(date);
                                fullDate.setHours(timeOfTheDay === 'am' ? hours : hours + 12);
                                field.onChange(fullDate.toISOString());
                              }}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder={hours} />
                              </SelectTrigger>

                              <SelectContent className="bg-background/40 filter backdrop-blur-3xl">
                                {new Array(12).fill('nothing').map((_, i) => (
                                  <SelectItem key={i} value={(i + 1).toString()}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={timeOfTheDay}
                              onValueChange={(value) => {
                                const timeOfTheDay = value === 'am' ? 'am' : 'pm';
                                setTimeOfTheDay(timeOfTheDay);
                                if (!date) return;

                                const fullDate = new Date(date);
                                fullDate.setHours(timeOfTheDay === 'am' ? hours : hours + 12);
                                field.onChange(fullDate.toISOString());
                              }}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder={timeOfTheDay} />
                              </SelectTrigger>

                              <SelectContent className="bg-background/40 filter backdrop-blur-3xl">
                                <SelectItem value="am">am</SelectItem>
                                <SelectItem value="pm">pm</SelectItem>
                              </SelectContent>
                            </Select>
                          </section>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {errors.startsAt && (
                      <p className="text-sm text-rose-500">{errors.startsAt.message}</p>
                    )}
                  </AutoAnimate>
                </div>
              )}
            />

            <Input
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

            <Input
              error={errors.minBid?.message}
              id="minBid"
              label="Minimum Bid"
              placeholder="Minimum bid value..."
              type="number"
              {...register('minBid')}
            />
            <Input
              error={errors.minBidders?.message}
              id="minBidders"
              label="Minimum Biders"
              placeholder="Minimum number of bidders"
              type="number"
              {...register('minBidders', { required: true })}
            />
            <Input
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
        </ScrollArea>

        <DialogFooter className="px-6">
          <DialogClose hidden className="hidden" ref={closeButtonRef}>
            Close
          </DialogClose>

          <Button
            type="submit"
            variant="secondary"
            onClick={onSubmit}
            loading={isRegisteringAuction}
            disabled={isRegisteringAuction}
            className="w-full"
          >
            Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
