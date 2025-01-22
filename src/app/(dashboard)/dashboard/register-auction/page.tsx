import { ScrollArea } from '@/components/ui/scroll-area';
import Form from './sections/form';
import Preview from './sections/preview';

export default function page() {
  return (
    <main className="grid pt-4 filter backdrop-blur-lg lg:pt-2 xl:grid-cols-2">
      <ScrollArea className="px-2 pb-4 xl:h-[calc(100vh-72px)]">
        <div className="bg-background/10 px-4">
          <Form />
        </div>
      </ScrollArea>

      <ScrollArea className="px-2 pb-4 xl:h-[calc(100vh-72px)]">
        <div className="px-2">
          <Preview />
        </div>
      </ScrollArea>
    </main>
  );
}
