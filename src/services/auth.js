import { customFetch } from "../utils/utils";

const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

export const signUpService = ({ email, password, name }) => {
  return customFetch(`${API_URL}/signup`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};

export const loginService = ({ email, password }) => {
  return customFetch(`${API_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const getUserData = (token) => {
  console.log("getUserData was called");
  return customFetch(`${API_URL}/userData`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const logoutUser = (refreshToken) => {
  return customFetch(`${API_URL}/logout`, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
    // No body is needed for logout, but if your API requires one, you can include it here
  });
};

export const refreshAuthToken = (refreshToken) => {
  return customFetch(`${API_URL}/token/refresh`, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
};
export const requestOtpService = ({ email }) => {
  return customFetch(`${API_URL}/requestOtp`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const verifyOtpService = ({ email, otp }) => {
  return customFetch(`${API_URL}/verifyOtp`, {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
};

export const resetPassword = (token, newPassword) => {
  return customFetch(`${API_URL}/reset/${token}`, {
    method: "POST",
    body: JSON.stringify({ password: newPassword }),
  });
};

export const requestPasswordReset = (email) => {
  return customFetch(`${API_URL}/forgot`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};
export const updateUserPassword = (token, currentPassword, newPassword) => {
  return customFetch(`${API_URL}/updatePassword`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};
