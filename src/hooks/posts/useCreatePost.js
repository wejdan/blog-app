import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthMutation } from "../common/useAuthMutation";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { createPost } from "../../services/posts";
import { useNavigate } from "react-router-dom";

export function useCreatePost(onSuccess, onMutationStart, onMutationEnd) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const createPostMutation = useAuthMutation(createPost, {
    onMutate: async () => {
      // Called immediately before the mutation function is fired
      if (onMutationStart) onMutationStart();
    },
    onSuccess: (post) => {
      // Invalidate queries and call onSuccess from props

      toast.success("Post was added successfuly", {
        duration: 5000,
        // isClosable is not a supported option in react-hot-toast
      });
      navigate(`/posts/${post.slug}`);
    },
    onError: (err) => {
      // Handle error

      toast.error(err.message, {
        duration: 5000,
        // isClosable is not a supported option in react-hot-toast
      });
    },
    onSettled: () => {
      // Called on either success or error
      if (onMutationEnd) onMutationEnd();
    },
  });

  return createPostMutation;
}
