'use client';

import { dummyProductImage, MILLIS, productConditions } from '@/lib/constants';
import { registerAuctionSchema, RegisterAuctionSchema } from '@/lib/form-schemas';
import { formatDate, imageToDataUri } from '@/lib/utils';
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
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

type CalendarDate = Date | null | [Date | null, Date | null];
type Props = { children: React.ReactNode; product: Product };
export default function RegisterAuctionDialog({ children, product }: Props) {
  const [date, onChange] = useState<CalendarDate>(() => {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  });
  const [hours, setHours] = useState(10);
  const [timeOfTheDay, setTimeOfTheDay] = useState<'am' | 'pm'>('am');
  const [imageUri, setImageUri] = useState<string | null>(product.image || dummyProductImage);
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const calculateScheduledDate = ({
    date,
    hours,
    timeOfTheDay
  }: {
    date: CalendarDate;
    hours: number;
    timeOfTheDay: 'am' | 'pm';
  }) => {
    const initialDate = new Date();
    initialDate.setHours(0);
    initialDate.setSeconds(0);
    initialDate.setMinutes(0);
    initialDate.setMilliseconds(0);

    const auctionDate = new Date(date?.toString() || initialDate);
    auctionDate.setHours(timeOfTheDay === 'am' ? hours : hours + 12);
    auctionDate.setSeconds(0);
    auctionDate.setMilliseconds(0);
    return auctionDate.toISOString();
  };

  const scheduledDate = calculateScheduledDate({ date, hours, timeOfTheDay });

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
      startsAt: new Date(date?.toString() || Date.now() + 6 * MILLIS.HOUR).toISOString(),
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
      <DialogContent className="flex max-h-screen flex-col bg-background/50 px-0 filter backdrop-blur-3xl lg:max-h-[calc(100vh-40px)]">
        <DialogHeader className="px-6">
          <DialogTitle className="text-center">Register an auction</DialogTitle>
        </DialogHeader>

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
                  <section className="flex w-full flex-col space-y-2">
                    <Label htmlFor="calendar">Select auction date</Label>
                    <Calendar
                      view="month"
                      className="!w-full !border-border !bg-transparent"
                      value={date}
                      onChange={(value) => {
                        onChange(value);
                        field.onChange(
                          calculateScheduledDate({
                            date: new Date(value?.toString() || Date.now()),
                            hours,
                            timeOfTheDay
                          })
                        );
                      }}
                      minDate={new Date(Date.now() + 3 * MILLIS.HOUR)}
                      maxDate={new Date(Date.now() + MILLIS.MONTH)}
                    />
                  </section>

                  <div className="space-y-1.5">
                    <Label>Select auction time</Label>
                    <section className="flex items-center space-x-3">
                      <Select
                        value={hours.toString()}
                        onValueChange={(value) => {
                          const hours = Number(value) || 10;
                          setHours(hours);
                          field.onChange(calculateScheduledDate({ date, hours, timeOfTheDay }));
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder={hours} />
                        </SelectTrigger>

                        <SelectContent>
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
                          field.onChange(calculateScheduledDate({ date, hours, timeOfTheDay }));
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder={timeOfTheDay} />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="am">am</SelectItem>
                          <SelectItem value="pm">pm</SelectItem>
                        </SelectContent>
                      </Select>
                    </section>
                  </div>
                  <p className="text-sm italic text-gray-300">
                    Schedule auction for: {formatDate(scheduledDate)}
                  </p>
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
