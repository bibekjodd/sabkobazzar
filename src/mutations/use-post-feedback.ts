import { backendUrl } from '@/lib/constants';
import { PostFeedbackSchema } from '@/lib/form-schemas';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const postFeedbackKey = ['post-feedback'];

export const usePostFeedback = () => {
  return useMutation({
    mutationKey: postFeedbackKey,
    mutationFn: postFeedback,
    onError(err) {
      toast.dismiss();
      toast.error(`Could not post feedback! ${extractErrorMessage(err)}`);
    },
    onSuccess() {
      toast.dismiss();
      toast.success('Your feedback was sent!');
    }
  });
};

const postFeedback = async (data: PostFeedbackSchema) => {
  await axios.post(`${backendUrl}/api/feedbacks`, data, { withCredentials: true });
};
