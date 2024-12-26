'use client';

import { createStore } from '@jodd/snap';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

const useImageDialog = createStore<{ isOpen: boolean; image: string | null }>(() => ({
  isOpen: false,
  image: null
}));

const onOpenChange = (isOpen: boolean) =>
  useImageDialog.setState((state) => ({ isOpen, image: isOpen ? state.image : null }));

export const openImageDialog = (image: string) => useImageDialog.setState({ isOpen: true, image });
export const closeImageDialog = () => onOpenChange(false);

export default function ImageDialog() {
  const { isOpen, image } = useImageDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="h-fit w-[calc(100%-20px)] max-w-md overflow-hidden rounded-md border-none p-0"
      >
        <DialogHeader className="sr-only">
          <DialogTitle />
        </DialogHeader>
        <DialogDescription className="sr-only" />
        {image && <img src={image} alt="image" className="max-h-[80vh] w-full object-cover" />}
      </DialogContent>
    </Dialog>
  );
}
