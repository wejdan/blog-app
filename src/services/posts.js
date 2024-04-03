import { customFetch } from "../utils/utils";

const API_URL = `${process.env.REACT_APP_API_URL}/posts`;

export const getRecentlyAddedPosts = () => {
  return customFetch(`${API_URL}/recently-added`, {
    method: "GET",
  });
};

export const getAllPosts = async (
  searchQuery = "",
  page = 1,
  pageSize,
  category
) => {
  const params = new URLSearchParams({
    query: searchQuery,
    page,
    pageSize,
  });
  if (category && category !== "All") {
    params.append("category", category);
  }
  return customFetch(`${API_URL}?${params.toString()}`, {
    method: "GET",
  });
};
export const getPostsByCategory = (categoryName) => {
  return customFetch(`${API_URL}/category/${categoryName}`, {
    method: "GET",
  });
};

export const createPost = (token, postData) => {
  return customFetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
};

export const getPost = ({ identifier, value }) => {
  return customFetch(`${API_URL}/post?${identifier}=${value}`, {
    method: "GET",
  });
};
export const getRecentPosts = () => {
  return customFetch(`${API_URL}/recently-added`, {
    method: "GET",
  });
};
export const updatePost = (token, { postId, postData }) => {
  return customFetch(`${API_URL}/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
};

export const deletePost = (token, postId) => {
  return customFetch(`${API_URL}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const fetchCategories = (signal) => {
  return customFetch(`${API_URL}/categories`, { signal });
};
// Additional service functions as required...
