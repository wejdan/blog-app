// In your hooks/actors/useGetActors.js file

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllPosts, getRecentPosts } from "../../services/posts";

export function useGetRecentPosts() {
  const queryResult = useQuery({
    queryKey: ["posts", "recents"],
    queryFn: () => getRecentPosts(),
    placeholderData: keepPreviousData,
  });

  return {
    ...queryResult,
  };
}
