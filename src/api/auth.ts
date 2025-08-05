import axios from './axios';

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post('http://localhost:5001/auth/login', credentials);
  console.log('response data',response.data);
  return response.data;
};

// Forgot password - request reset
export const forgotPassword = async (email: string) => {
  const response = await axios.post('http://localhost:5001/auth/forgot-password', { email });
  return response.data;
};

// Reset password with token
export const resetPassword = async (token: string, password: string) => {
  const response = await axios.post('http://localhost:5001/auth/reset-password', { token, password });
  return response.data;
};