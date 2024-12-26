'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import Avatar from '@/components/utils/avatar';
import { useWindowSize } from '@/hooks/use-window-size';
import { dummyAuctionBanner } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { useProfile } from '@/queries/use-profile';
import { createStore } from '@jodd/snap';
import dayjs from 'dayjs';
import {
  BadgeCheckIcon,
  BadgeDollarSignIcon,
  ClockIcon,
  GlobeIcon,
  GlobeLockIcon,
  LetterTextIcon,
  PackageIcon,
  ReceiptTextIcon,
  UsersRoundIcon,
  VoteIcon
} from 'lucide-react';

export type PreviewData = {
  title: string;
  banner: string | undefined;
  description: string;
  productTitle: string;
  brand: string;
  productImages: string[];
  category: string;
  lot: number;
  condition: string;
  minBid: number;
  minBidders: number;
  maxBidders: number;
  startsAt: string | undefined;
  isInviteOnly: boolean;
};

export const usePreviewData = createStore<PreviewData>(() => ({
  title: '',
  banner: undefined,
  description: '',
  productTitle: '',
  brand: '',
  productImages: [],
  category: '',
  lot: 1,
  condition: '',
  minBid: 10_000,
  minBidders: 2,
  maxBidders: 10,
  startsAt: undefined,
  isInviteOnly: false
}));

const usePreviewDrawer = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));
const onOpenChange = (isOpen: boolean) => usePreviewDrawer.setState({ isOpen });
export const openPreviewDrawer = () => onOpenChange(true);
export const closePreviewDrawer = () => onOpenChange(false);

export default function Preview() {
  const { width } = useWindowSize();
  if (width >= 1280) return <BaseContent />;

  return <PreviewDrawer />;
}

function PreviewDrawer() {
  const { isOpen } = usePreviewDrawer();
  const title = usePreviewData((state) => state.title);
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="ml-auto flex h-screen w-fit max-w-[500px] flex-col rounded-tr-none px-4">
        <DrawerHeader>
          <DrawerTitle className="line-clamp-2 text-center text-brand">
            {title || <span className="italic text-foreground">Auction title</span>}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="hidden" />

        <ScrollArea className="h-full">
          <BaseContent />
        </ScrollArea>

        <DrawerFooter className="sm:hidden">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function BaseContent() {
  const data = usePreviewData();
  const { data: profile } = useProfile();
  if (!profile) return null;

  return (
    <section className="">
      <div className="hidden items-center space-x-2 text-lg italic text-muted-foreground xl:flex">
        <LetterTextIcon className="size-5" />
        <span>Form Preview</span>
      </div>

      <h3 className="mb-4 line-clamp-2 hidden text-center text-xl font-medium text-brand xl:block">
        {data.title || <span className="italic text-muted-foreground">Auction title</span>}
      </h3>
      <img
        src={data.banner || dummyAuctionBanner}
        className="aspect-video w-full object-cover"
        alt="banner"
      />

      <section className="mt-6 space-y-2 rounded-md bg-indigo-950/10 p-4 text-sm text-muted-foreground filter backdrop-blur-3xl [&_svg]:mr-1.5 [&_svg]:inline [&_svg]:size-3.5 [&_svg]:-translate-y-0.5">
        <div>
          <p className="mb-1.5">Host</p>

          <div className="flex w-fit items-center space-x-3">
            <Avatar src={profile.image} size="sm" />
            <span className="text-base font-medium text-foreground">{profile.name}</span>
          </div>
        </div>

        <div className="!my-5 h-[1px] bg-muted-foreground/15" />

        <div>
          {data.isInviteOnly && (
            <>
              <GlobeLockIcon /> <span>Private Auction</span>
            </>
          )}
          {!data.isInviteOnly && (
            <>
              <GlobeIcon /> <span>Public Auction</span>
            </>
          )}
        </div>

        <div>
          <PackageIcon /> Product: <span className="font-medium">{data.productTitle}</span>
        </div>

        {data.brand && (
          <div className="capitalize">
            <BadgeCheckIcon /> Brand: {data.brand}
          </div>
        )}

        <div>
          <VoteIcon /> Condition: {data.condition}
        </div>
        <div>
          <ReceiptTextIcon /> Product lot: {data.lot}
        </div>
        <div>
          <UsersRoundIcon /> Allowed participants: {data.minBidders}-{data.maxBidders}
        </div>
        <div>
          <BadgeDollarSignIcon /> Minimum bid amount: {formatPrice(data.minBid)}
        </div>

        <div className="pb-2">
          <p>Product Images</p>
          {data.productImages.length === 0 && (
            <span className="text-xs italic text-muted-foreground/90">
              No any product images selected
            </span>
          )}
          {data.productImages.length > 0 && (
            <div className="mt-3 flex items-center space-x-2 px-2">
              {data.productImages.map((image) => (
                <img
                  src={image}
                  key={image}
                  alt="product image"
                  className="max-w-1/3 h-full max-h-24 w-fit cursor-zoom-in object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          Description: <span className="text-muted-foreground/90">{data.description}</span>
        </div>

        <p className="italic">
          <ClockIcon className="inline size-3.5" /> <span>Scheduled for </span>
          {data.startsAt ? (
            <span className="italic">Not specified</span>
          ) : (
            dayjs(data.startsAt).format('MMMM DD, YYYY ha')
          )}
        </p>
      </section>
    </section>
  );
}
