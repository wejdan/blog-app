import { customFetch } from "../utils/utils";

const API_URL = `${process.env.REACT_APP_API_URL}/user`;

export const deleteUser = (token, userId) => {
  return customFetch(`${API_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getAllUsers = (token) => {
  return customFetch(`${API_URL}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUser = (token, { userId, data }) => {
  return customFetch(`${API_URL}/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

export const updateProfilePicture = (token, imageUrl) => {
  return customFetch(`${API_URL}/profile-picture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ imageUrl }),
  });
};

// ... include other service functions as defined in your example
