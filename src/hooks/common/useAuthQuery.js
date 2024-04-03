import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  authenticate,
  logout,
  logoutAction,
  refreshAuthTokens,
  setTokens,
} from "../../store/authSlice";
import { refreshAuthToken } from "../../services/auth";

export const useAuthQuery = (queryKey, queryFn, config = {}, ...args) => {
  const queryClient = useQueryClient();
  const { user, accessToken, refreshToken } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const isQueryEnabled = user !== null;
  // console.log(queryKey, user);
  // console.log("useAuthQuery isQueryEnabled,", queryKey, isQueryEnabled);
  // console.log("user", user);

  const enhancedQueryFn = async (...queryArgs) => {
    // This function will automatically attempt to refresh the token if needed
    // and retry the queryFn with the new token
    async function executeQueryWithRefresh() {
      try {
        const result = await queryFn(accessToken, ...queryArgs);
        // Attempt to run the original query function first

        return result;
      } catch (error) {
        if (error.status === 401) {
          // Assuming error.status is set correctly
          const newTokens = await dispatch(refreshAuthTokens()).unwrap();

          // Retry the query with new tokens

          return await queryFn(newTokens.accessToken, ...queryArgs);
        } else {
          throw error; // For errors other than 401, re-throw them
        }

        // if (
        //   error.status === 403 ||
        //   error.status === 401 ||
        //   error.message === "No refresh token available"
        // ) {
        //   toast.dismiss();
        //   toast.error("Session expired. Please log in again.", {
        //     duration: 5000,
        //     // isClosable is not a supported option in react-hot-toast
        //   });
        //   closeAllModals();
        //   logout();
        //   //   navigate("/login");
        // } else {
        //   throw error;
        // }
      }
    }

    return executeQueryWithRefresh();
  };
  //s console.log(user, "isQueryEnabled=", isQueryEnabled);
  return useQuery({
    queryKey: [...queryKey],
    queryFn: enhancedQueryFn,
    ...config,
    enabled: isQueryEnabled,
    placeholderData: keepPreviousData,
  });
};
