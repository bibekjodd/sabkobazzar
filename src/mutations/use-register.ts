import { backendUrl } from '@/lib/constants';
import { RegisterSchema } from '@/lib/form-schemas';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage, uploadImage } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useRegister = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async ({
      image,
      ...data
    }: RegisterSchema & { image: string | File | undefined }) => {
      const imageUrl = image instanceof File ? await uploadImage(image) : undefined;

      const res = await axios.post<{ user: UserProfile }>(
        `${backendUrl}/api/auth/register`,
        { ...data, image: typeof image === 'string' ? image : imageUrl },
        {
          withCredentials: true
        }
      );
      return res.data.user;
    },

    onError(err) {
      toast.error(`Could not register account! ${extractErrorMessage(err)}`);
    },
    onSuccess(data) {
      queryClient.setQueryData<UserProfile>(profileKey, data);
    }
  });
};
