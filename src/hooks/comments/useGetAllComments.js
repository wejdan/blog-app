// In your hooks/actors/useGetActors.js file

import { useQuery } from "@tanstack/react-query";

import { useAuthQuery } from "../common/useAuthQuery";
import { getAllComments } from "../../services/comments";

export function useGetAllComments() {
  const queryResult = useAuthQuery(["comments"], getAllComments, {
    meta: {
      errorMessage: "Failed to fetch comments",
    },
  });

  return {
    ...queryResult,
  };
}
