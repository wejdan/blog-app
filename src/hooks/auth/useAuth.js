import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  loginService,
  requestOtp,
  requestOtpService,
  signUpService,
  verifyOtp,
  verifyOtpService,
} from "../../services/auth";
import {
  authenticate,
  fetchUserData,
  logoutAction,
} from "../../store/authSlice";
import toast from "react-hot-toast";

export function useAuth() {
  const dispatch = useDispatch();
  // Rehydrate auth state from localStorage
  // Sign up mutation
  const {
    mutate: signupMutate,
    isPending: isSignupLoading,
    isError: isSignupError,
    error: signupError,
  } = useMutation({
    mutationFn: signUpService,
    onSuccess: async (data) => {
      const authData = {
        uid: data.user.id,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      dispatch(authenticate({ user: authData }));
      dispatch(fetchUserData(data.accessToken));
    },
    onError: (error) => {
      // Handle the error
      toast.dismiss(); // Dismiss any existing toast first

      toast.error(error.message, {
        duration: 5000,
        // isClosable is not a supported option in react-hot-toast
      });
    },
  });

  // Login mutation
  const {
    mutate: loginMutate,
    isPending: isLoginLoading,
    isError: isLoginError,
    error: loginError,
  } = useMutation({
    mutationFn: loginService,
    onSuccess: async (data) => {
      const authData = {
        uid: data.user.id,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      //   queryClient.setQueryData(["auth"], authData);

      dispatch(authenticate({ user: authData }));
      dispatch(fetchUserData(data.accessToken));
    },
    onError: (error) => {
      console.log("onErr", error);
      // Handle the error
      toast.dismiss(); // Dismiss any existing toast first

      toast.error(error.message, {
        duration: 5000,
        // isClosable is not a supported option in react-hot-toast
      });
    },
  });

  const requestOtpMutation = useMutation({
    mutationFn: requestOtpService,
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpService,
  });

  // Logout function
  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    signup: signupMutate,
    isSignupLoading,
    isSignupError,
    signupError,
    login: loginMutate,
    isLoginLoading,
    isLoginError,
    loginError,
    logout,

    requestOtp: requestOtpMutation.mutateAsync,
    isRequestOtpLoading: requestOtpMutation.isPending,
    isRequestOtpError: requestOtpMutation.isError,
    requestOtpError: requestOtpMutation.error,

    verifyOtp: verifyOtpMutation.mutateAsync,
    isVerifyOtpLoading: verifyOtpMutation.isPending,
    isVerifyOtpError: verifyOtpMutation.isError,
    verifyOtpError: verifyOtpMutation.error,
  };
}
