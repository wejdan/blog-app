// In your hooks/actors/useGetActors.js file

import { useQuery } from "@tanstack/react-query";

import { useAuthQuery } from "../common/useAuthQuery";
import { getAllComments } from "../../services/comments";
import { getAllUsers } from "../../services/user";

export function useGetAllUsers() {
  const queryResult = useAuthQuery(["users"], getAllUsers, {
    meta: {
      errorMessage: "Failed to fetch users",
    },
  });

  return {
    ...queryResult,
  };
}
