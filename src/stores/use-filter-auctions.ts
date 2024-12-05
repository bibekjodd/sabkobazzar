import { KeyOptions } from '@/queries/use-auctions';
import { createStore } from '@jodd/snap';

export type AuctionsFilterParams = {
  title: string | null | undefined;
  category: KeyOptions['category'] | null | undefined;
  owner: string | null | undefined;
  sort: KeyOptions['sort'] | null | undefined;
  status: KeyOptions['status'] | null | undefined;
  condition: KeyOptions['condition'] | null | undefined;
};

type State = {
  isInitial: boolean;
  filters: AuctionsFilterParams;
};

export const useFilterAuctions = createStore<State>(() => ({
  isInitial: true,
  filters: {
    title: null,
    category: null,
    owner: null,
    sort: null,
    status: null,
    condition: null
  }
}));

export const updateInitialFilterAuctions = (data: Partial<AuctionsFilterParams>) => {
  if (!useFilterAuctions.getState().isInitial) return;
  useFilterAuctions.setState({
    filters: {
      title: data.title || null,
      category: data.category || null,
      owner: data.owner || null,
      sort: data.sort || null,
      status: data.status || null,
      condition: data.condition || null
    }
  });
};

export const updateFilterAuctions = (filters: AuctionsFilterParams) =>
  useFilterAuctions.setState({ filters });

export const clearFilterAuctions = () =>
  useFilterAuctions.setState((state) => ({
    filters: {
      category: null,
      owner: null,
      sort: null,
      status: null,
      condition: null,
      title: state.filters.title
    }
  }));
