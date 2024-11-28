import { createStore } from '@jodd/snap';

type State = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const useLoginDialog = createStore<State>((set) => ({
  isOpen: false,
  onOpenChange(isOpen) {
    set({ isOpen });
  }
}));

export const openLoginDialog = () => {
  useLoginDialog.setState({ isOpen: true });
};

export const closeLoginDialog = () => {
  useLoginDialog.setState({ isOpen: false });
};
