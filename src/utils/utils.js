export const handleResponseError = async (response) => {
  const responseData = await response.json(); // Attempt to parse response body
  const error = new Error(responseData.message || "An error occurred");
  error.status = response.status; // Attach status code to the error
  throw error;
};
export async function customFetch(url, options = {}) {
  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    // For FormData, let the browser set Content-Type header

    defaultHeaders["Content-Type"] = "application/json";
  }

  // Authorization header if token is provided
  if (options.token) {
    defaultHeaders["Authorization"] = `Bearer ${options.token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: "include", // Add this line
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    return await response.json();
  } catch (error) {
    // Handle other types of errors as before
    throw error;
  }
}
