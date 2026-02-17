// API configuration utility
const getApiBaseUrl = () => {
  // In production, use environment variable or fallback to relative path
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In development, use proxy (from package.json)
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
};

