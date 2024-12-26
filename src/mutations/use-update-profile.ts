import { closeUpdateProfileDialog } from '@/components/dialogs/update-profile-dialog';
import { apiClient } from '@/lib/api-client';
import { UpdateProfileSchema } from '@/lib/form-schemas';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage, uploadImage } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const updateProfileKey = ['update-profile'];

export const useUpdateProfile = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: updateProfileKey,
    mutationFn: updateProfile,

    onError(err) {
      toast.error(`Could not update profile! ${extractErrorMessage(err)}`);
      queryClient.invalidateQueries({ queryKey: profileKey });
    },

    onSuccess(updatedProfile) {
      closeUpdateProfileDialog();
      toast.success('Profile updated successfully');
      queryClient.setQueryData(profileKey, updatedProfile);
    }
  });
};

type Options = Partial<UpdateProfileSchema> & { image: string | undefined | File };
const updateProfile = async ({ image, ...data }: Options): Promise<UserProfile> => {
  const uploadedImagePromise = image instanceof File ? uploadImage(image) : undefined;

  const updateProfilePromise = apiClient
    .put<{ user: UserProfile }>(
      '/api/users/profile',
      {
        ...data,
        image: typeof image === 'string' ? image : undefined
      },
      { withCredentials: true }
    )
    .then((res) => res.data.user);

  const [imageUrl, user] = await Promise.all([uploadedImagePromise, updateProfilePromise]);
  if (imageUrl) updateProfile({ image: imageUrl });

  return { ...user, image: imageUrl || user.image };
};
