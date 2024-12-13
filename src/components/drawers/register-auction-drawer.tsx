'use client';

import { MILLIS, auctionProductConditions, productsCategories } from '@/lib/constants';
import { RegisterAuctionSchema, registerAuctionSchema } from '@/lib/form-schemas';
import { formatPrice, imageToDataUri } from '@/lib/utils';
import { registerAuctionKey, useRegisterAuction } from '@/mutations/use-register-auction';
import { zodResolver } from '@hookform/resolvers/zod';
import { AutoAnimate } from '@jodd/auto-animate';
import { createStore } from '@jodd/snap';
import { useIsMutating } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { CalendarIcon, ImageIcon, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { openImageDialog } from '../dialogs/image-dialog';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Checkbox } from '../ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../ui/drawer';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

const useRegisterAuctionDrawer = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));
const onOpenChange = (isOpen: boolean) => useRegisterAuctionDrawer.setState({ isOpen });
export const openRegisterAuctionDrawer = () => onOpenChange(true);
export const closeRegisterAuctionDrawer = () => onOpenChange(false);

export default function RegisterAuctionDrawer() {
  const [date, setDate] = useState<Date>();
  const [hours, setHours] = useState(10);
  const [timeOfTheDay, setTimeOfTheDay] = useState<'am' | 'pm'>('am');
  const fullDate = useMemo(() => {
    if (!date) return undefined;
    const fullDate = new Date(date);
    fullDate.setHours(timeOfTheDay === 'am' ? hours : hours + 12);
    return fullDate;
  }, [date, hours, timeOfTheDay]);

  const [bannerImageUri, setBannerImageUri] = useState<string | null>(null);
  const bannerImagePickerRef = useRef<HTMLInputElement>(null);
  const [productImagesUris, setProductImagesUris] = useState<string[]>([]);
  const productImagesPickerRef = useRef<HTMLInputElement>(null);

  const unpickBannerImage = () => {
    if (bannerImagePickerRef.current) bannerImagePickerRef.current.value = '';
    setBannerImageUri(null);
  };

  const onPickBannerImage = async () => {
    if (!bannerImagePickerRef.current?.files) return unpickBannerImage();
    const bannerImageUri = await imageToDataUri(bannerImagePickerRef.current.files[0]);
    setBannerImageUri(bannerImageUri);
  };

  const unpickProductImages = () => {
    if (productImagesPickerRef.current) productImagesPickerRef.current.value = '';
    setProductImagesUris([]);
  };

  const onPickProductImages = async () => {
    if (!productImagesPickerRef.current?.files) return unpickProductImages();
    const productImagesUris: string[] = [];
    for (let i = 0; i < 3; i++) {
      const imageFile = productImagesPickerRef.current.files[i];
      if (!imageFile) break;
      const imageUri = await imageToDataUri(imageFile);
      productImagesUris.push(imageUri);
    }
    setProductImagesUris(productImagesUris);
  };

  const {
    formState: { errors },
    watch,
    handleSubmit,
    register,
    control,
    reset
  } = useForm<RegisterAuctionSchema>({
    resolver: zodResolver(registerAuctionSchema),
    defaultValues: {
      minBid: 10000,
      minBidders: 2,
      maxBidders: 10,
      lot: 1,
      condition: 'first-class',
      isInviteOnly: false,
      category: 'arts'
    }
  });
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isRegisteringAuction = !!useIsMutating({ mutationKey: registerAuctionKey });
  const { mutate } = useRegisterAuction();

  const onSubmit = handleSubmit((data: RegisterAuctionSchema) => {
    let bannerImage: File | undefined = undefined;
    if (bannerImagePickerRef.current?.files) bannerImage = bannerImagePickerRef.current.files[0];

    const productImages: File[] = [];
    if (productImagesPickerRef.current?.files) {
      for (let i = 0; i < 3; i++) {
        const imageFile = productImagesPickerRef.current.files[i];
        if (!imageFile) break;
        productImages.push(imageFile);
      }
    }

    mutate(
      { ...data, bannerImage, productImages },
      {
        onSuccess() {
          reset();
          unpickBannerImage();
          closeButtonRef.current?.click();
        }
      }
    );
  });

  const { isOpen } = useRegisterAuctionDrawer();

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-screen px-0 lg:h-[calc(100%-32px)]">
        <DrawerHeader className="px-6">
          <DrawerTitle className="text-center">Register an auction</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="hidden" />

        <ScrollArea>
          <div className="mx-auto flex w-full max-w-screen-md flex-col px-5">
            <form
              onSubmit={onSubmit}
              className="grid h-full gap-x-4 gap-y-7 px-1 pb-6 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <Input
                  id="title"
                  label="Title"
                  error={errors.title?.message}
                  placeholder="Auction title..."
                  {...register('title')}
                />
              </div>

              <section className="space-y-1.5 md:col-span-2">
                <Label htmlFor="image">Banner image</Label>
                <div
                  onClick={() => !bannerImageUri && bannerImagePickerRef.current?.click()}
                  className="relative grid aspect-video place-items-center rounded-lg border border-dashed"
                >
                  {bannerImageUri && (
                    <div
                      onClick={unpickBannerImage}
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
                    ref={bannerImagePickerRef}
                    onChange={onPickBannerImage}
                  />
                  {!bannerImageUri && (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="size-8" />
                      <p className="p-4 text-sm">
                        Provide 16:9 aspect ratio image for better compatibility
                      </p>
                    </div>
                  )}
                  {bannerImageUri && (
                    <img
                      src={bannerImageUri}
                      loading="lazy"
                      decoding="async"
                      alt="selected image"
                      className="aspect-video w-full rounded-lg object-contain"
                    />
                  )}
                </div>
              </section>

              <section className="flex flex-col space-y-1.5 md:col-span-2">
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

              <Input
                id="product-title"
                label="Product Title"
                error={errors.productTitle?.message}
                placeholder="Product title..."
                {...register('productTitle')}
              />

              <Input
                id="brand"
                label="Product Brand"
                error={errors.brand?.message}
                placeholder="Product brand..."
                {...register('brand')}
              />

              <section className="space-y-1.5 md:col-span-2">
                <Label htmlFor="image">Product Images </Label>
                <div
                  onClick={() =>
                    productImagesUris.length === 0 && productImagesPickerRef.current?.click()
                  }
                  className="relative grid aspect-[48/9] place-items-center rounded-lg border border-dashed"
                >
                  {productImagesUris.length !== 0 && (
                    <div
                      onClick={unpickProductImages}
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
                    multiple
                    ref={productImagesPickerRef}
                    onChange={onPickProductImages}
                  />
                  {productImagesUris.length === 0 && (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="size-8" />
                      <div className="p-4">
                        <p className="text-sm">
                          Provide 16:9 aspect ratio image for better compatibility
                        </p>
                        <p className="mt-0.5 text-center text-xs italic text-indigo-100/80">
                          (Max 3 images)
                        </p>
                      </div>
                    </div>
                  )}
                  {productImagesUris.length > 0 && (
                    <div className="flex items-center justify-start space-x-2">
                      {productImagesUris.map((uri, i) => (
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

              <section className="flex flex-col space-y-2">
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Arts" />
                      </SelectTrigger>
                      <SelectContent>
                        {productsCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </section>

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
                        {auctionProductConditions.map((condition) => (
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
                label={`Minimum Bid - ${Number(watch('minBid')) ? formatPrice(watch('minBid')) : ''}`}
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

              <Controller
                control={control}
                name="startsAt"
                render={({ field }) => (
                  <div className="flex flex-col space-y-3 md:col-span-2">
                    <AutoAnimate className="flex w-full flex-col space-y-2">
                      <Label htmlFor="calendar">Select Date</Label>

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

              <section className="flex items-center space-x-2 md:col-span-2">
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
          </div>
        </ScrollArea>

        <DrawerFooter className="mx-auto w-full max-w-screen-md px-6">
          <DrawerClose hidden className="hidden" ref={closeButtonRef}>
            Close
          </DrawerClose>

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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}