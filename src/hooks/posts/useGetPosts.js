import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../services/posts";

export function useGetPosts(searchQuery = "", currentPage = 1) {
  const queryResult = useQuery({
    queryKey: ["posts", searchQuery, currentPage],
    queryFn: () => getAllPosts(searchQuery, currentPage),
    placeholderData: keepPreviousData,
    meta: {
      errorMessage: "Failed to fetch posts",
    },
  });

  return {
    ...queryResult,
  };
}
