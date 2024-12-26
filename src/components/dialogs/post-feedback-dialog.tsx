'use client';

import { PostFeedbackSchema, postFeedbackSchema } from '@/lib/form-schemas';
import { postFeedbackKey, usePostFeedback } from '@/mutations/use-post-feedback';
import { useProfile } from '@/queries/use-profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStore } from '@jodd/snap';
import { useIsMutating } from '@tanstack/react-query';
import { MessageSquareTextIcon, SendHorizontalIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { openAuthDialog } from './auth-dialog';

const usePostfeedbackDialog = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));
const onOpenChange = (isOpen: boolean) => usePostfeedbackDialog.setState({ isOpen });
export const openPostFeedbackDialog = () => onOpenChange(true);
export const closePostFeedbackDialog = () => onOpenChange(false);

const ratings: { value: number; title: string }[] = [
  { value: 1, title: 'Highly dissatisfied' },
  { value: 2, title: 'Dissatisfied' },
  { value: 3, title: 'Neutral' },
  { value: 4, title: 'Satisfied' },
  { value: 5, title: 'Highly Satisfied' }
];

export default function PostFeedbackDialog() {
  const { isOpen } = usePostfeedbackDialog();
  const { data: profile } = useProfile();

  const {
    formState: { errors },
    handleSubmit,
    control,
    register,
    reset
  } = useForm<PostFeedbackSchema>({
    resolver: zodResolver(postFeedbackSchema),
    defaultValues: { rating: 4 }
  });
  const isPostingFeedback = !!useIsMutating({ mutationKey: postFeedbackKey });
  const { mutate } = usePostFeedback();
  const onSubmit = handleSubmit(async (data: PostFeedbackSchema) => {
    if (!profile) {
      openAuthDialog();
      return;
    }

    mutate(data, {
      onSuccess() {
        reset();
      }
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center space-x-2">
            <MessageSquareTextIcon className="size-5" />
            <span>Send us Feedback</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <ScrollArea className="h-96">
          <form className="space-y-5 p-2" onSubmit={onSubmit}>
            <Input
              {...register('title')}
              label="Title"
              id="title"
              placeholder="Feedback title..."
              error={errors.title?.message}
            />

            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue="4">
                    <SelectTrigger>
                      <SelectValue placeholder />
                    </SelectTrigger>

                    <SelectContent ref={field.ref}>
                      {ratings.map((rating) => (
                        <SelectItem key={rating.value} value={rating.value.toString()}>
                          {rating.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.rating?.message && (
                <p className="text-sm text-error">{errors.rating.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Feedback</Label>
              <Textarea
                {...register('text')}
                rows={6}
                id="text"
                placeholder="Give us your honest feedback...."
              />
              {errors.text?.message && <p className="text-sm text-error">{errors.text.message}</p>}
            </div>
          </form>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>

          <Button
            Icon={SendHorizontalIcon}
            onClick={onSubmit}
            loading={isPostingFeedback}
            disabled={isPostingFeedback}
          >
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
