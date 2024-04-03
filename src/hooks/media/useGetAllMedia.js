import { useInfiniteQuery } from "@tanstack/react-query";
import { listImages } from "../../services/imgs";
import { useDispatch, useSelector } from "react-redux";
import { refreshAuthToken } from "../../services/auth";
import {
  authenticate,
  logoutAction,
  refreshAuthTokens,
  setTokens,
} from "../../store/authSlice";

export function useGetAllMedia(pageSize = 10) {
  const { user, accessToken, refreshToken } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  return useInfiniteQuery({
    queryKey: ["media"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await listImages({
          token: accessToken,
          pageSize,
          pageNumber: pageParam,
        });
        return result;
      } catch (error) {
        if (error.status === 401) {
          // Assuming error.status is set correctly

          try {
            const newTokens = await dispatch(refreshAuthTokens()).unwrap();

            // Retry the query with new tokens

            // Re
            //   queryClient.setQueryData(["auth"], authData);

            // Retry the query with new tokens

            const result = await listImages({
              token: newTokens?.accessToken,
              pageSize,
              pageNumber: pageParam,
            });
            return result;
          } catch (refreshError) {
            // Refresh token failed; log out the user
            dispatch(logoutAction());
            throw new Error("Session expired. Please log in again.");
          }
        } else {
          throw error; // For errors other than 401, re-throw them
        }
      }
      // The API now expects pageNumber instead of pageToken
    },
    getNextPageParam: (lastPage, allPages) => {
      // Calculate next page based on current data
      const currentPage = lastPage?.currentPage || 0;
      const totalPages = lastPage?.totalPages || 0;

      return currentPage < totalPages ? currentPage + 1 : null;
    },
  });
}
