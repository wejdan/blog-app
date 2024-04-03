// In your hooks/actors/useGetActors.js file

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../services/posts";

export function useGetAllCategories() {
  const queryResult = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
    placeholderData: keepPreviousData,

    meta: {
      errorMessage: "Failed to fetch categories",
    },
  });

  return {
    ...queryResult,
  };
}
