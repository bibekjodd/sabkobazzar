'use client';
import { registerAuctionSchema, RegisterAuctionSchema } from '@/lib/form-schemas';
import { useRegisterAuction } from '@/mutations/use-register-auction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIsMutating } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
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
import { FormInput } from '../utils/form-input';

type CalendarDate = Date | null | [Date | null, Date | null];
type Props = { children: React.ReactNode; product: Product };
export default function RegisterAuctionDialog({ children, product }: Props) {
  const [date, onChange] = useState<CalendarDate>(() => new Date());
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
      maxBidders: 10
    }
  });
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isRegisteringAuction = !!useIsMutating({ mutationKey: ['register-auction'] });
  const { mutate } = useRegisterAuction();

  const onSubmit = handleSubmit((data: RegisterAuctionSchema) => {
    mutate(
      { productId: product.id, ...data },
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
      <DialogContent className="flex max-h-screen flex-col bg-background/50 filter backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-center">Register an auction</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="flex h-full flex-col space-y-7 overflow-y-auto px-1 scrollbar-thin"
        >
          <div className="flex w-full flex-col space-y-2">
            <Label htmlFor="calendar">Select the date</Label>
            <Controller
              control={control}
              name="startsAt"
              render={({ field }) => (
                <Calendar
                  view="month"
                  className="!w-full !border-border !bg-black"
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
          </div>

          <FormInput
            Icon={null}
            error={errors.minBid?.message}
            id="minBid"
            label="Minimum Bid"
            placeholder="Minimum bid value..."
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
        </form>

        <DialogFooter>
          <DialogClose asChild ref={closeButtonRef}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
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
