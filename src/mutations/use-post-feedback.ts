import { closePostFeedbackDialog } from '@/components/dialogs/post-feedback-dialog';
import { apiClient } from '@/lib/api-client';
import { PostFeedbackSchema } from '@/lib/form-schemas';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const postFeedbackKey = ['post-feedback'];

export const usePostFeedback = () => {
  return useMutation({
    mutationKey: postFeedbackKey,
    mutationFn: postFeedback,
    onError(err) {
      toast.error(`Could not post feedback! ${extractErrorMessage(err)}`);
    },
    onSuccess() {
      closePostFeedbackDialog();
      toast.success('Your feedback was sent!');
    }
  });
};

const postFeedback = async (data: PostFeedbackSchema) => {
  await apiClient.post('/api/feedbacks', data, { withCredentials: true });
};
