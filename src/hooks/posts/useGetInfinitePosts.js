// In your hooks/actors/useGetActors.js file

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../services/posts";

export function useGetInfinitePosts(searchQuery = "", pageSize = 10, category) {
  const queryResult = useInfiniteQuery({
    queryKey: ["posts", searchQuery, pageSize, category],
    queryFn: ({ pageParam = 1 }) =>
      getAllPosts(searchQuery, pageParam, pageSize, category),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined; // No more pages available
    },
  });

  return {
    ...queryResult,
  };
}
