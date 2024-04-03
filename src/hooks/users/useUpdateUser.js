import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthMutation } from "../common/useAuthMutation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { updateUser } from "../../services/user";
import { setUserData } from "../../store/authSlice";

export function useUpdateUser(onSuccess, onMutationStart, onMutationEnd) {
  const dispatch = useDispatch();
  const updateUserMutation = useAuthMutation(updateUser, {
    onMutate: async () => {
      // Called immediately before the mutation function is fired
      if (onMutationStart) onMutationStart();
    },
    onSuccess: (data) => {
      // Invalidate queries and call onSuccess from props
      dispatch(setUserData({ userData: data.user }));

      toast.success("User was updated successfuly", {
        duration: 5000,
        // isClosable is not a supported option in react-hot-toast
      });
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

  return updateUserMutation;
}
