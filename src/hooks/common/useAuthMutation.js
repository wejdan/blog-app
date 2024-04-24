import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import {
  authenticate,
  logoutAction,
  refreshAuthTokens,
  setTokens,
} from "../../store/authSlice";
import { toast } from "react-hot-toast";
import { refreshAuthToken } from "../../services/auth";

export const useAuthMutation = (mutationFn, config) => {
  const navigate = useNavigate();
  const { user, accessToken, refreshToken } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: async (data) => {
      // Check if the token is valid before making the API call
      // if (!isTokenValid(user.token)) {
      //   closeAllModals();
      //   dispatch(logout());
      //   navigate("/login");

      //   // Throw an error or return a promise rejection to halt the mutation
      //   return Promise.reject(new Error("Session expired"));
      // }
      try {
        return await mutationFn(accessToken, data);
      } catch (error) {
        if (error.status === 401) {
          // Assuming error.status is set correctly
          const newTokens = await dispatch(refreshAuthTokens()).unwrap();

          // Retry the original mutation with the new access token
          return await mutationFn(newTokens.accessToken, data);
        } else {
          throw error; // For errors other than 401, re-throw them
        }
      }
    },
    ...config,
    onError: (error) => {
      // Handle the error
      toast.dismiss(); // Dismiss any existing toast first

      if (error.status === 403 || error.status === 401) {
        toast.error("Session expired. Please log in again.", {
          duration: 5000,
          // isClosable is not a supported option in react-hot-toast
        });
        dispatch(logoutAction());
        navigate("/login");
      }
    },
  });

  return mutation;
};
