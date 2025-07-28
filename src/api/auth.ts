import axios from './axios';

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post('http://localhost:5001/auth/login', credentials);
  console.log('response',response.data);
  return response.data;
};