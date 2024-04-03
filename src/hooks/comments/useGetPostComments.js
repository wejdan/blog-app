// In your hooks/actors/useGetActors.js file

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../services/posts";
import { getCommentsForPost } from "../../services/comments";

export function useGetPostComments(postId) {
  const queryResult = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsForPost(postId),
    enabled: postId !== undefined,
    placeholderData: keepPreviousData,
  });

  return {
    ...queryResult,
  };
}
