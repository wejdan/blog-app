import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthMutation } from "../common/useAuthMutation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { updateProfilePicture } from "../../services/user";
import { getSignedURL, uploadImageToStorage } from "../../services/imgs";
import { useAuthQuery } from "../common/useAuthQuery";
import { setUserData } from "../../store/authSlice";
import { useState } from "react";

export function useUpdateProfileImg(onSuccess, onMutationStart, onMutationEnd) {
  const getSignedUrlMutation = useAuthMutation(getSignedURL);
  const updateProfilePictureMutation = useAuthMutation(updateProfilePicture);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleImageUpload = async (file) => {
    try {
      // Request a signed URL
      setLoading(true);
      const signedUrlData = await getSignedUrlMutation.mutateAsync({
        type: "profile",
      });
      const { signedUrl, publicUrl } = signedUrlData;

      // Upload file using the signed URL
      await uploadImageToStorage(file, signedUrl);

      // Update user profile with the public URL
      await updateProfilePictureMutation.mutateAsync(publicUrl);
      dispatch(setUserData({ userData: { profileImg: publicUrl } }));
      toast.success("Profile picture updated successfully");
      return publicUrl;
    } catch (error) {
      console.error("Error during image upload:", error);
      toast.error("Error updating profile picture");
    } finally {
      setLoading(false);
    }
  };

  return { handleImageUpload, loading };
}
