import SelectAuctionProductDialog from '@/components/dialogs/select-auction-product-dialog';
import { Button } from '@/components/ui/button';
import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export default function page() {
  return (
    <main className="p-4">
      <section className="grid min-h-[calc(100vh-120px)] place-items-center py-10">
        {graphics}
        <div className="flex flex-col items-center">
          <div className="relative mb-5 h-fit w-fit overflow-hidden border-b border-purple-500 p-2 uppercase">
            <div className="absolute left-0 top-0 -z-10 aspect-square w-full translate-y-2 rounded-full bg-purple-400/25 blur-md" />
            <p className="text-xs tracking-wider text-purple-500">#1 Reselling Platform</p>
          </div>
          <h2
            className={cn(
              poppins.className,
              'mb-7 flex flex-col items-center space-y-5 text-center text-3xl font-medium xs:text-5xl'
            )}
          >
            <span>Drop your product</span>
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-800 bg-clip-text text-transparent">
              To the Auction now
            </span>
          </h2>

          <SelectAuctionProductDialog>
            <Button variant="moving-border">Register for an auction</Button>
          </SelectAuctionProductDialog>
        </div>
      </section>
    </main>
  );
}

const graphics = (
  <>
    {/* lines */}
    <div className="fixed -z-10 h-screen w-full bg-gradient-to-b from-black/80 p-4 opacity-50 lg:ml-64 lg:p-20">
      <div className="flex w-full flex-wrap">
        {new Array(700).fill('nothing').map((_, i) => (
          <div key={i} className="size-12 border border-l-0 border-t-0 border-white/5" />
        ))}
      </div>
    </div>
    {/* corner light */}
    <div className="fixed left-0 top-10 -z-10 size-40 rounded-full bg-indigo-400/15 blur-3xl md:size-60 lg:left-72" />
    <div className="fixed right-0 top-16 -z-10 size-40 rounded-full bg-purple-400/15 blur-3xl md:size-60" />
    {/* bg-shadow */}
    <div className="fixed top-1/2 -z-10 mt-10 flex">
      <div className="size-[600px] -translate-y-1/2 translate-x-24 rounded-full bg-indigo-600/10 mix-blend-multiply blur-3xl filter" />
      <div className="size-[600px] -translate-x-24 -translate-y-1/2 rounded-full bg-purple-600/10 mix-blend-multiply blur-3xl filter" />
    </div>
  </>
);
