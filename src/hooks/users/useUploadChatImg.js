import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthMutation } from "../common/useAuthMutation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { updateProfilePicture } from "../../services/user";
import { getSignedURL, uploadImageToStorage } from "../../services/imgs";
import { useAuthQuery } from "../common/useAuthQuery";
import { setUserData } from "../../store/authSlice";
import { useState } from "react";
import { useSocketContext } from "../../context/SocketContext";

export function useUploadChatImg() {
  const getSignedUrlMutation = useAuthMutation(getSignedURL);
  const [loading, setLoading] = useState(false);
  const handleImageUpload = async (file, type) => {
    try {
      // Request a signed URL
      setLoading(true);
      const signedUrlData = await getSignedUrlMutation.mutateAsync({
        type: type ? type : "chat",
        fileName: file.name,
      });
      const { signedUrl, publicUrl } = signedUrlData;

      // Upload file using the signed URL
      await uploadImageToStorage(file, signedUrl);

      // Update user profile with the public URL
      //onSuccess({ chatdId, url: publicUrl });
      return publicUrl;
    } catch (error) {
      console.error("Error during image upload:", error);
      toast.error("Error updating group picture");
    } finally {
      setLoading(false);
    }
  };

  return { handleImageUpload, loading };
}
