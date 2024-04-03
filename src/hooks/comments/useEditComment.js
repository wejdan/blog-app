import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { createPost, deletePost } from "../../services/posts";
import { useNavigate } from "react-router-dom";
import { useAuthMutation } from "../common/useAuthMutation";
import { deleteComment, updateComment } from "../../services/comments";

export function useEditComment(onSuccess, onMutationStart, onMutationEnd) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const updatePostMutation = useAuthMutation(updateComment, {
    onMutate: async () => {
      // Called immediately before the mutation function is fired
      if (onMutationStart) onMutationStart();
    },
    onSuccess: () => {
      // Invalidate queries and call onSuccess from props

      queryClient.invalidateQueries("comments");
      if (onSuccess) onSuccess();
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

  return updatePostMutation;
}
