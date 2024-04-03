import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthMutation } from "../common/useAuthMutation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { updateProfilePicture } from "../../services/user";
import {
  getSignedURL,
  indexFile,
  uploadImageToStorage,
} from "../../services/imgs";
import { useAuthQuery } from "../common/useAuthQuery";
import { setUserData } from "../../store/authSlice";
import { useState } from "react";
function extractBucketNameAndFileName(url) {
  const matches = url.match(
    /https:\/\/storage\.googleapis\.com\/([^\/]+)\/(.+)/
  );
  if (!matches || matches.length < 3) {
    throw new Error("Invalid URL");
  }
  return { bucketName: matches[1], name: matches[2] };
}
export function useUploadMedia() {
  const queryClient = useQueryClient();

  const getSignedUrlMutation = useAuthMutation(getSignedURL);
  const indexFileMutation = useAuthMutation(indexFile); // Use the auth mutation wrapper if needed
  const [loading, setLoading] = useState(false);
  const handleImageUpload = async (file) => {
    try {
      // Request a signed URL
      setLoading(true);
      const signedUrlData = await getSignedUrlMutation.mutateAsync({
        type: "post",
        isTemporary: false,
      });
      const { signedUrl, publicUrl } = signedUrlData;

      // Upload file using the signed URL
      const { name } = extractBucketNameAndFileName(publicUrl);
      console.log("***********", name);
      await uploadImageToStorage(file, signedUrl);
      await indexFileMutation.mutateAsync({
        name, // Extracted file name
        publicUrl, // Public URL of the uploaded file
        timeCreated: new Date().toISOString(), // Current time as creation time
      });
      queryClient.invalidateQueries("media", {
        refetchActive: true,
        refetchInactive: true,
      });
      // Update user profile with the public URL

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
