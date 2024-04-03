import { customFetch } from "../utils/utils";

const API_URL = `${process.env.REACT_APP_API_URL}/posts`;

export const getCommentsForPost = (postId) => {
  return customFetch(`${API_URL}/${postId}/comments`, {
    method: "GET",
  });
};
export const getAllComments = (token) => {
  return customFetch(`${process.env.REACT_APP_API_URL}/comments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createComment = (token, { postId, commentData }) => {
  return customFetch(`${API_URL}/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commentData),
  });
};

export const updateComment = (
  token,
  { postId, commentId, updatedCommentData }
) => {
  return customFetch(`${API_URL}/${postId}/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedCommentData),
  });
};

export const deleteComment = (token, { postId, commentId }) => {
  return customFetch(`${API_URL}/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const toggleLikeComment = (token, { postId, commentId, like }) => {
  const action = like ? "like" : "unlike";
  return customFetch(`${API_URL}/${postId}/comments/${commentId}/${action}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
