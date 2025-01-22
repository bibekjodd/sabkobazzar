import { cn } from '@/lib/utils';
import { useAuctionsHistoryDrawer } from '.';

export default function Tabs() {
  const { activeTab } = useAuctionsHistoryDrawer();
  return (
    <div className="mb-4 flex space-x-1 px-6 text-sm">
      <button
        onClick={() => useAuctionsHistoryDrawer.setState({ activeTab: 'all' })}
        className={cn('rounded-full px-6 py-2 hover:bg-brand/10 hover:text-brand', {
          'bg-brand/10 text-brand': activeTab === 'all',
          'bg-muted-foreground/5': activeTab !== 'all'
        })}
      >
        All
      </button>

      <button
        onClick={() => useAuctionsHistoryDrawer.setState({ activeTab: 'joined' })}
        className={cn('rounded-full px-6 py-2 hover:bg-brand/10 hover:text-brand', {
          'bg-brand/10 text-brand': activeTab === 'joined',
          'bg-muted-foreground/5': activeTab !== 'joined'
        })}
      >
        Joined
      </button>

      <button
        onClick={() => useAuctionsHistoryDrawer.setState({ activeTab: 'invited' })}
        className={cn('rounded-full px-6 py-2 hover:bg-brand/10 hover:text-brand', {
          'bg-brand/10 text-brand': activeTab === 'invited',
          'bg-muted-foreground/5': activeTab !== 'invited'
        })}
      >
        Invited
      </button>
    </div>
  );
}
