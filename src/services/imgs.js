import { customFetch } from "../utils/utils";
const API_URL = `${process.env.REACT_APP_API_URL}/storage`;

export const uploadImageToStorage = async (file, signedUrl) => {
  return fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: file,
  });
};

export const deleteSelectedImages = async (token, imageNames) => {
  return customFetch(`${API_URL}/delete-images/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ imageNames }),
  });
};
export const getSignedURL = (token, { type, isTemporary }) => {
  // Construct the query string
  let queryString = `type=${type}`;
  if (isTemporary) {
    queryString += `&isTemporary=true`;
  }

  return customFetch(`${API_URL}/generate-signed-url/?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const indexFile = async (token, { name, publicUrl, timeCreated }) => {
  const url = `${API_URL}/indexFile`;

  // Prepare the body data. Assuming fileData includes name, publicUrl, and timeCreated
  const bodyData = JSON.stringify({ name, publicUrl, timeCreated });

  return customFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: bodyData,
  });
};
export const listImages = async ({
  token,
  pageSize = 10,
  pageNumber = 1,
} = {}) => {
  let params = new URLSearchParams();

  // Only add pageToken and pageSize to the URL if they have valid values
  if (pageNumber) params.append("page", pageNumber);
  if (pageSize) params.append("pageSize", pageSize);

  let url = `${API_URL}/images?${params.toString()}`;

  // Custom fetch wrapper that handles authorization and JSON parsing
  return await customFetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Ensure response includes nextPageToken and the list of images
};

// Function to delete a specific image from storage
export const deleteImage = (token, imageName) => {
  return customFetch(`${API_URL}/images/${imageName}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
