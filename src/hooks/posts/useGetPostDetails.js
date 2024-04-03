// In your hooks/actors/useGetActors.js file

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPost } from "../../services/posts";

export function useGetPost(identifier, value) {
  const queryResult = useQuery({
    queryKey: ["post", identifier, value],
    queryFn: () => getPost({ identifier, value }),
    placeholderData: keepPreviousData,
  });

  return {
    ...queryResult,
  };
}
