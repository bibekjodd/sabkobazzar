'use client';
import { PageDrawer } from '@/components/drawers/page-drawer';
import ProductOverview, { productOverviewSkeleton } from '@/components/product-overview';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { useProduct } from '@/queries/use-product';
import { CircleAlert } from 'lucide-react';

export default function Page({ params }: { params: { id: string } }) {
  const { data: product, isLoading, error } = useProduct(params.id);

  return (
    <PageDrawer className="flex h-full flex-col bg-background/50 filter backdrop-blur-3xl md:h-[calc(100vh-40px)]">
      <div className="mx-auto h-full w-full max-w-screen-xl overflow-y-auto p-4 scrollbar-thin">
        {error && (
          <div className="pt-7">
            <Alert variant="destructive">
              <CircleAlert className="size-4" />
              <AlertTitle>Could not find product</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid h-full place-items-center py-7">
          {isLoading && <div className="w-full">{productOverviewSkeleton}</div>}
          {product && <ProductOverview product={product} />}
        </div>
      </div>

      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="outline" className="w-full bg-transparent">
            Close
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </PageDrawer>
  );
}
