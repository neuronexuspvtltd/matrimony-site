import { mockApiRequest } from './mockApi';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('matrimony_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('matrimony_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('matrimony_token');
  localStorage.removeItem('pb_current_user');
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  // Client-side execution without backend server requirement!
  // Can be seamlessly connected to Firebase / Cloud Database later if needed.
  return await mockApiRequest(endpoint, options);
};
